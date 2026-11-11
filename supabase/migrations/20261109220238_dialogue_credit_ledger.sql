-- All money and credit movements are serialized in one database transaction.
-- No browser role can read or mutate the billing tables or call the dispatcher.
create schema if not exists dialogue;
revoke all on schema dialogue from public, anon, authenticated;
create table dialogue.settings (
  id boolean primary key default true check (id), enabled boolean not null default false,
  monthly_cap bigint not null default 0 check (monthly_cap >= 0),
  guest_allocation bigint not null default 0 check (guest_allocation >= 0),
  welcome_allocation bigint not null default 0 check (welcome_allocation >= 0),
  welcome_credits bigint not null default 0 check (welcome_credits >= 0),
  welcome_cost bigint not null default 0 check (welcome_cost >= welcome_credits * 10000),
  check (guest_allocation + welcome_allocation <= monthly_cap)
);
insert into dialogue.settings default values;
create table dialogue.models (
  id text primary key, label text not null, enabled boolean not null default false,
  guest_default boolean not null default false,
  -- USD millionths per million tokens; all accounting uses integer USD millionths.
  input_rate bigint not null check(input_rate >= 0), output_rate bigint not null check(output_rate >= 0),
  short_price bigint not null check(short_price > 0), medium_price bigint check(medium_price > 0),
  short_output integer not null check(short_output between 512 and 8192),
  medium_output integer check(medium_output between 512 and 8192)
);
create unique index one_guest_default on dialogue.models (guest_default) where guest_default;
create table dialogue.months (
  month date primary key, guest_spent bigint not null default 0, welcome_spent bigint not null default 0
);
create table dialogue.accounts (
  user_id uuid primary key references auth.users(id), welcome bigint not null default 0 check(welcome >= 0),
  purchased bigint not null default 0 check(purchased >= 0), granted boolean not null default false
);
create table dialogue.guests (
  token_hash text primary key, used integer not null default 0 check(used between 0 and 10)
);
create table dialogue.requests (
  id uuid primary key, user_id uuid references auth.users(id), guest_hash text references dialogue.guests(token_hash),
  model text not null references dialogue.models(id), length text not null, month date not null,
  input_rate bigint not null, output_rate bigint not null, max_output integer not null,
  welcome_reserved bigint not null default 0, purchased_reserved bigint not null default 0,
  status text not null default 'pending' check(status in ('pending','succeeded','failed')),
  created_at timestamptz not null default now(), finished_at timestamptz,
  check ((user_id is null) <> (guest_hash is null))
);
create index pending_requests on dialogue.requests(created_at) where status='pending';
create table dialogue.attempts (
  request_id uuid references dialogue.requests(id), attempt integer check(attempt between 0 and 1),
  reserved_cost bigint not null, actual_cost bigint, model text not null,
  elapsed_ms integer, provider_status integer, finish_reason text, validation text,
  input_tokens bigint, output_tokens bigint, thought_tokens bigint,
  primary key(request_id, attempt)
);
create function public.dialogue_service(p_action text, p_data jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  cfg dialogue.settings; model_row dialogue.models; acct dialogue.accounts; req dialogue.requests;
  mon dialogue.months; att dialogue.attempts;
  uid uuid := nullif(p_data->>'userId','')::uuid;
  rid uuid := nullif(p_data->>'requestId','')::uuid;
  current_month date := date_trunc('month', now() at time zone 'UTC')::date;
  price bigint; welcome_part bigint; max_output integer; ceiling_cost bigint; actual bigint;
begin
  perform pg_advisory_xact_lock(2200261109);
  -- The provider deadline is 25 seconds. After ten minutes, crashed requests cannot finish.
  for req in select * from dialogue.requests where status='pending' and created_at < now()-interval '10 minutes' loop
    update dialogue.accounts set welcome=welcome+req.welcome_reserved,purchased=purchased+req.purchased_reserved where user_id=req.user_id;
    update dialogue.requests set status='failed',finished_at=now() where id=req.id;
  end loop;
  select * into strict cfg from dialogue.settings where id;
  insert into dialogue.months(month) values(current_month) on conflict do nothing;
  select * into strict mon from dialogue.months where month = current_month;

  if p_action = 'account' then
    if uid is null then raise exception 'Sign in first.'; end if;
    -- Eligibility requires a verified, non-anonymous Supabase account.
    if not exists(select 1 from auth.users where id=uid and email_confirmed_at is not null and not coalesce(is_anonymous,false)) then
      raise exception 'Verify your email first.';
    end if;
    insert into dialogue.accounts(user_id) values(uid) on conflict do nothing;
    select * into strict acct from dialogue.accounts where user_id=uid;
    if not acct.granted and cfg.enabled and cfg.welcome_credits > 0 and cfg.welcome_cost > 0
      and mon.welcome_spent + cfg.welcome_cost <= cfg.welcome_allocation
      and mon.guest_spent + mon.welcome_spent + cfg.welcome_cost <= cfg.monthly_cap then
      update dialogue.accounts set welcome=welcome+cfg.welcome_credits, granted=true where user_id=uid returning * into acct;
      update dialogue.months set welcome_spent=welcome_spent+cfg.welcome_cost where month=current_month;
    end if;
    return jsonb_build_object('welcome',acct.welcome,'purchased',acct.purchased);
  elsif p_action = 'catalog' then
    return jsonb_build_object('enabled',cfg.enabled,'models',coalesce((select jsonb_agg(jsonb_build_object(
      'id',id,'label',label,'guestDefault',guest_default,'shortPrice',short_price,'mediumPrice',medium_price,
      'shortOutput',short_output,'mediumOutput',medium_output)) from dialogue.models where enabled),'[]'::jsonb));
  elsif p_action = 'begin' then
    if not cfg.enabled then raise exception 'Generation is unavailable.'; end if;
    select * into model_row from dialogue.models where id=p_data->>'model' and enabled;
    if not found then raise exception 'Choose an available model.'; end if;
    if p_data->>'length' = 'short' then price:=model_row.short_price; max_output:=model_row.short_output;
    elsif p_data->>'length' = 'medium' then price:=model_row.medium_price; max_output:=model_row.medium_output;
    else raise exception 'Choose a valid scene length.'; end if;
    if price is null or max_output is null then raise exception 'Choose an available length.'; end if;
    ceiling_cost:=ceil((20000::numeric*model_row.input_rate+max_output::numeric*model_row.output_rate)/1000000);
    -- One credit is backed by at most one US cent of provider cost, including the retry.
    if ceiling_cost <= 0 or price::numeric*10000 < 2*ceiling_cost then raise exception 'Model pricing is not configured.'; end if;
    if uid is null then
      if not model_row.guest_default then raise exception 'Sign in to select this model.'; end if;
      if length(p_data->>'guestHash') <> 64 then raise exception 'Invalid guest session.'; end if;
      insert into dialogue.guests(token_hash) values(p_data->>'guestHash') on conflict do nothing;
      update dialogue.guests set used=used+1 where token_hash=p_data->>'guestHash' and used<10;
      if not found then raise exception 'Guest limit reached. Sign in to continue.'; end if;
    else
      if price <> (p_data->>'quotedPrice')::bigint or p_data->>'quotedPrice' is null then raise exception 'The price changed. Review the new price.'; end if;
      select * into acct from dialogue.accounts where user_id=uid;
      if not found or acct.welcome+acct.purchased<price then raise exception 'Not enough credits.'; end if;
      welcome_part:=least(acct.welcome,price);
      update dialogue.accounts set welcome=welcome-welcome_part,purchased=purchased-(price-welcome_part) where user_id=uid;
    end if;
    insert into dialogue.requests(id,user_id,guest_hash,model,length,month,input_rate,output_rate,max_output,welcome_reserved,purchased_reserved)
      values(rid,uid,case when uid is null then p_data->>'guestHash' end,model_row.id,p_data->>'length',current_month,model_row.input_rate,model_row.output_rate,max_output,
      coalesce(welcome_part,0),case when uid is null then 0 else price-welcome_part end);
    return jsonb_build_object('maxOutputTokens',max_output);
  elsif p_action in ('reserve_call','record_attempt','finish') then
    select * into strict req from dialogue.requests where id=rid;
    if req.status <> 'pending' then
      if p_action='finish' then return jsonb_build_object('status',req.status); end if;
      raise exception 'Request is already settled.';
    end if;
    select * into strict model_row from dialogue.models where id=req.model;
    if p_action='reserve_call' then
      if not cfg.enabled then raise exception 'Generation is unavailable.'; end if;
      -- 20,000 input tokens is a conservative ceiling for the byte-limited prompt.
      max_output:=req.max_output;
      ceiling_cost:=ceil((20000::numeric*req.input_rate+max_output::numeric*req.output_rate)/1000000);
      if ceiling_cost <= 0 then raise exception 'Model pricing is not configured.'; end if;
      if req.guest_hash is not null then
        if mon.guest_spent+ceiling_cost>cfg.guest_allocation or mon.guest_spent+mon.welcome_spent+ceiling_cost>cfg.monthly_cap then
          raise exception 'Guest generation is unavailable. Sign in to continue.';
        end if;
        update dialogue.months set guest_spent=guest_spent+ceiling_cost where month=current_month;
      end if;
      insert into dialogue.attempts(request_id,attempt,reserved_cost,model) values(rid,(p_data->>'attempt')::integer,ceiling_cost,req.model);
      return '{}'::jsonb;
    elsif p_action='record_attempt' then
      select * into strict att from dialogue.attempts where request_id=rid and attempt=(p_data->>'attempt')::integer;
      if p_data->>'inputTokens' is not null and p_data->>'outputTokens' is not null then
        actual:=ceil(((p_data->>'inputTokens')::numeric*req.input_rate +
          ((p_data->>'outputTokens')::numeric+coalesce((p_data->>'thoughtTokens')::numeric,0))*req.output_rate)/1000000);
      end if;
      update dialogue.attempts set actual_cost=actual,elapsed_ms=(p_data->>'elapsedMs')::integer,
        provider_status=(p_data->>'providerStatus')::integer,finish_reason=left(p_data->>'finishReason',40),
        validation=left(p_data->>'validation',40),input_tokens=(p_data->>'inputTokens')::bigint,
        output_tokens=(p_data->>'outputTokens')::bigint,thought_tokens=(p_data->>'thoughtTokens')::bigint
        where request_id=rid and attempt=att.attempt;
      -- Keep the conservative debit even if usage is missing or the process dies.
      return '{}'::jsonb;
    else
      if coalesce((p_data->>'success')::boolean,false) then
        if not exists(select 1 from dialogue.attempts where request_id=rid and validation='passed') then raise exception 'Scene has not passed validation.'; end if;
        update dialogue.requests set status='succeeded',finished_at=now() where id=rid;
      else
        update dialogue.accounts set welcome=welcome+req.welcome_reserved,purchased=purchased+req.purchased_reserved where user_id=req.user_id;
        update dialogue.requests set status='failed',finished_at=now() where id=rid;
      end if;
      return jsonb_build_object('status',case when coalesce((p_data->>'success')::boolean,false) then 'succeeded' else 'failed' end);
    end if;
  elsif p_action='reconcile' then return '{}'::jsonb;
  else raise exception 'Unknown operation.';
  end if;
end $$;
revoke all on function public.dialogue_service(text,jsonb) from public, anon, authenticated;
grant execute on function public.dialogue_service(text,jsonb) to service_role;
-- Defense in depth if the schema is ever exposed through PostgREST.
do $$ declare t text; begin
  foreach t in array array['settings','models','months','accounts','guests','requests','attempts'] loop
    execute format('alter table dialogue.%I enable row level security',t);
  end loop;
end $$;

create view dialogue.cost_summary with (security_invoker = true) as
select r.month,r.model,count(distinct r.id) filter(where r.status='succeeded') as usable_scenes,
  coalesce(sum(a.actual_cost),0) as known_cost,
  count(*) filter(where a.actual_cost is null) as calls_with_unknown_cost,
  coalesce(sum(coalesce(a.actual_cost,a.reserved_cost)),0) as conservative_cost,
  sum(coalesce(a.actual_cost,a.reserved_cost)) / nullif(count(distinct r.id) filter(where r.status='succeeded'),0) as cost_per_usable_scene
from dialogue.requests r join dialogue.attempts a on a.request_id=r.id group by r.month,r.model;
