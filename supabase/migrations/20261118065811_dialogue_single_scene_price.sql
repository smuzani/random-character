select pg_advisory_xact_lock(2200261109);

-- Keep the short-scene price as the single price for every supported length.
update dialogue.models set medium_output = null where medium_price is null;
alter table dialogue.models rename column short_price to credit_price;
alter table dialogue.models drop column medium_price;

-- Track signed-in provider reservations independently of the number of credits charged.
alter table dialogue.months add column signed_in_spent bigint not null default 0 check (signed_in_spent >= 0);

with reserved as (
  select request.month, sum(attempt.reserved_cost) as cost
  from dialogue.requests request
  join dialogue.attempts attempt on attempt.request_id = request.id
  where request.user_id is not null
  group by request.month
)
update dialogue.months month
set signed_in_spent = reserved.cost
from reserved
where month.month = reserved.month;

create or replace function public.dialogue_service(p_action text, p_data jsonb default '{}'::jsonb)
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
      and greatest(mon.welcome_spent + cfg.welcome_cost, mon.signed_in_spent) <= cfg.welcome_allocation
      and mon.guest_spent + greatest(mon.welcome_spent + cfg.welcome_cost, mon.signed_in_spent) <= cfg.monthly_cap then
      update dialogue.accounts set welcome=welcome+cfg.welcome_credits, granted=true where user_id=uid returning * into acct;
      update dialogue.months set welcome_spent=welcome_spent+cfg.welcome_cost where month=current_month;
    end if;
    return jsonb_build_object('welcome',acct.welcome,'purchased',acct.purchased);
  elsif p_action = 'catalog' then
    return jsonb_build_object('enabled',cfg.enabled,'models',coalesce((select jsonb_agg(jsonb_build_object(
      'id',id,'label',label,'guestDefault',guest_default,'shortPrice',credit_price,
      'mediumPrice',case when medium_output is not null then credit_price end,
      'shortOutput',short_output,'mediumOutput',medium_output)) from dialogue.models where enabled),'[]'::jsonb));
  elsif p_action = 'begin' then
    if not cfg.enabled then raise exception 'Generation is unavailable.'; end if;
    select * into model_row from dialogue.models where id=p_data->>'model' and enabled;
    if not found then raise exception 'Choose an available model.'; end if;
    if p_data->>'length' = 'short' then max_output:=model_row.short_output;
    elsif p_data->>'length' = 'medium' then max_output:=model_row.medium_output;
    else raise exception 'Choose a valid scene length.'; end if;
    price:=model_row.credit_price;
    if max_output is null then raise exception 'Choose an available length.'; end if;
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
        if mon.guest_spent+ceiling_cost>cfg.guest_allocation or mon.guest_spent+greatest(mon.welcome_spent,mon.signed_in_spent)+ceiling_cost>cfg.monthly_cap then
          raise exception 'Guest generation is unavailable. Sign in to continue.';
        end if;
        update dialogue.months set guest_spent=guest_spent+ceiling_cost where month=current_month;
      else
        -- Grant issuance and provider calls each have the signed-in allocation as a ceiling.
        -- The grants fund access to these same calls, so count the higher of the two in the overall cap.
        if mon.signed_in_spent+ceiling_cost>cfg.welcome_allocation
          or mon.guest_spent+greatest(mon.welcome_spent,mon.signed_in_spent+ceiling_cost)>cfg.monthly_cap then
          raise exception 'Generation is unavailable.';
        end if;
        update dialogue.months set signed_in_spent=signed_in_spent+ceiling_cost where month=current_month;
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
