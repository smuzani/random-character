-- One launch offer. Prices/terms are copied into each purchase before checkout.
-- No offer is seeded: payments stay unavailable until deliberately configured.
create table dialogue.credit_packs (
  id uuid primary key default gen_random_uuid(),
  enabled boolean not null default false,
  environment text not null check (environment in ('sandbox','production')),
  price_id text not null check (price_id ~ '^pri_[a-z0-9]{26}$'),
  amount bigint not null check (amount between 1 and 100000000),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  credits bigint not null check (credits between 1 and 1000000),
  terms text not null check (length(terms) between 10 and 2000)
);
create unique index one_enabled_credit_pack on dialogue.credit_packs(enabled) where enabled;
create table dialogue.purchases (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  pack_id uuid not null references dialogue.credit_packs(id),
  environment text not null, price_id text not null, amount bigint not null,
  currency text not null, credits bigint not null, terms text not null,
  transaction_id text unique check (transaction_id ~ '^txn_[a-z0-9]{26}$'),
  created_at timestamptz not null default now(), fulfilled_at timestamptz
);
create index purchases_by_user on dialogue.purchases(user_id, created_at);
create table dialogue.payment_events (
  id text primary key, purchase_id uuid not null references dialogue.purchases(id),
  type text not null, received_at timestamptz not null default now()
);
-- Refunds/disputes require operator reconciliation; never silently leave credits spendable.
create table dialogue.payment_holds (
  purchase_id uuid primary key references dialogue.purchases(id),
  reason text not null, created_at timestamptz not null default now(), resolved_at timestamptz
);
alter table dialogue.credit_packs enable row level security;
alter table dialogue.purchases enable row level security;
alter table dialogue.payment_events enable row level security;
alter table dialogue.payment_holds enable row level security;
revoke all on dialogue.credit_packs, dialogue.purchases, dialogue.payment_events, dialogue.payment_holds from public, anon, authenticated;

create function public.dialogue_payments(p_action text, p_data jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  offer dialogue.credit_packs; purchase dialogue.purchases;
  uid uuid := nullif(p_data->>'userId','')::uuid;
begin
  -- Share the generation lock so grants, spending, and payment holds cannot race.
  perform pg_advisory_xact_lock(2200261109);
  if p_action = 'catalog' then
    select * into offer from dialogue.credit_packs where enabled and environment=p_data->>'environment';
    if not found then return 'null'::jsonb; end if;
    return jsonb_build_object('id',offer.id,'amount',offer.amount,'currency',offer.currency,
      'credits',offer.credits,'terms',offer.terms);
  elsif p_action in ('create','status') then
    if uid is null or not exists(select 1 from auth.users where id=uid and email_confirmed_at is not null and not coalesce(is_anonymous,false)) then
      raise exception 'Verify your email first.';
    end if;
    if p_action='status' then
      select * into purchase from dialogue.purchases where id=(p_data->>'purchaseId')::uuid and user_id=uid;
      if not found then raise exception 'Purchase not found.'; end if;
      return jsonb_build_object('status',case
        when exists(select 1 from dialogue.payment_holds where purchase_id=purchase.id and resolved_at is null) then 'review'
        when purchase.fulfilled_at is not null then 'fulfilled' else 'pending' end);
    end if;
    if exists(select 1 from dialogue.payment_holds h join dialogue.purchases p on p.id=h.purchase_id where p.user_id=uid and h.resolved_at is null) then
      raise exception 'Your payment needs review. Contact support.';
    end if;
    select * into offer from dialogue.credit_packs where enabled and id=(p_data->>'packId')::uuid and environment=p_data->>'environment';
    if not found then raise exception 'This credit pack is unavailable. Refresh the page.'; end if;
    -- Prevent accepting a stale browser quote after an operator edits the offer.
    if (p_data->>'amount')::bigint is distinct from offer.amount
      or p_data->>'currency' is distinct from offer.currency
      or (p_data->>'credits')::bigint is distinct from offer.credits
      or p_data->>'terms' is distinct from offer.terms then
      raise exception 'The pack changed. Review the new terms.';
    end if;
    if (select count(*) from dialogue.purchases where user_id=uid and created_at>now()-interval '1 hour') >= 10 then
      raise exception 'Too many checkout attempts. Try again later.';
    end if;
    insert into dialogue.accounts(user_id) values(uid) on conflict do nothing;
    insert into dialogue.purchases(id,user_id,pack_id,environment,price_id,amount,currency,credits,terms)
      values((p_data->>'purchaseId')::uuid,uid,offer.id,offer.environment,offer.price_id,offer.amount,offer.currency,offer.credits,offer.terms)
      returning * into purchase;
    return to_jsonb(purchase);
  elsif p_action='bind' then
    select * into strict purchase from dialogue.purchases where id=(p_data->>'purchaseId')::uuid;
    if purchase.transaction_id is not null and purchase.transaction_id <> p_data->>'transactionId' then raise exception 'Purchase is already bound.'; end if;
    update dialogue.purchases set transaction_id=p_data->>'transactionId' where id=purchase.id;
    return '{}'::jsonb;
  elsif p_action in ('fulfill','hold') then
    select * into strict purchase from dialogue.purchases where transaction_id=p_data->>'transactionId' and environment=p_data->>'environment';
    if p_action='fulfill' then
      if p_data->>'purchaseId' is distinct from purchase.id::text
        or p_data->>'status' is distinct from 'completed'
        or p_data->>'priceId' is distinct from purchase.price_id
        or (p_data->>'amount')::bigint is distinct from purchase.amount
        or p_data->>'currency' is distinct from purchase.currency
        or (p_data->>'quantity')::integer is distinct from 1
        or (p_data->>'total')::bigint is null or (p_data->>'total')::bigint < purchase.amount then
        raise exception 'Payment does not match purchase.';
      end if;
    end if;
    insert into dialogue.payment_events(id,purchase_id,type) values(p_data->>'eventId',purchase.id,p_action) on conflict do nothing;
    if not found then return jsonb_build_object('duplicate',true); end if;
    if p_action='hold' then
      insert into dialogue.payment_holds(purchase_id,reason) values(purchase.id,p_data->>'reason')
        on conflict(purchase_id) do update set reason=excluded.reason,resolved_at=null;
    elsif purchase.fulfilled_at is null then
      update dialogue.accounts set purchased=purchased+purchase.credits where user_id=purchase.user_id;
      if not found then raise exception 'Purchase account is missing.'; end if;
      update dialogue.purchases set fulfilled_at=now() where id=purchase.id;
    end if;
    return '{}'::jsonb;
  else raise exception 'Unknown payment operation.';
  end if;
end $$;
revoke all on function public.dialogue_payments(text,jsonb) from public, anon, authenticated;
grant execute on function public.dialogue_payments(text,jsonb) to service_role;

-- Preserve the existing dispatcher, including welcome-first spending and failed-request refunds.
alter function public.dialogue_service(text,jsonb) rename to dialogue_service_before_payments;
alter function public.dialogue_service_before_payments(text,jsonb) set schema dialogue;
revoke all on function dialogue.dialogue_service_before_payments(text,jsonb) from public, anon, authenticated, service_role;
create function public.dialogue_service(p_action text, p_data jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(2200261109);
  if p_action='begin' and exists(
    select 1 from dialogue.payment_holds h join dialogue.purchases p on p.id=h.purchase_id
    where p.user_id=nullif(p_data->>'userId','')::uuid and h.resolved_at is null
  ) then raise exception 'Your payment needs review. Contact support.'; end if;
  return dialogue.dialogue_service_before_payments(p_action,p_data);
end $$;
revoke all on function public.dialogue_service(text,jsonb) from public, anon, authenticated;
grant execute on function public.dialogue_service(text,jsonb) to service_role;
