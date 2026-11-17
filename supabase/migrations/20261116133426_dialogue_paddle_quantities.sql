-- Paddle overlay permits changing quantity. Each verified unit is one credit pack.
alter table dialogue.purchases add column fulfilled_quantity integer check (fulfilled_quantity between 1 and 10);
update dialogue.purchases set fulfilled_quantity=1 where fulfilled_at is not null;

create or replace function public.dialogue_payments(p_action text, p_data jsonb default '{}'::jsonb)
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
        or (p_data->>'quantity')::integer is null or (p_data->>'quantity')::integer not between 1 and 10
        or (p_data->>'total')::bigint is null or (p_data->>'total')::bigint < purchase.amount * (p_data->>'quantity')::integer then
        raise exception 'Payment does not match purchase.';
      end if;
    end if;
    insert into dialogue.payment_events(id,purchase_id,type) values(p_data->>'eventId',purchase.id,p_action) on conflict do nothing;
    if not found then return jsonb_build_object('duplicate',true); end if;
    if p_action='hold' then
      insert into dialogue.payment_holds(purchase_id,reason) values(purchase.id,p_data->>'reason')
        on conflict(purchase_id) do update set reason=excluded.reason,resolved_at=null;
    elsif purchase.fulfilled_at is null then
      update dialogue.accounts set purchased=purchased+purchase.credits * (p_data->>'quantity')::integer where user_id=purchase.user_id;
      if not found then raise exception 'Purchase account is missing.'; end if;
      update dialogue.purchases set fulfilled_at=now(), fulfilled_quantity=(p_data->>'quantity')::integer where id=purchase.id;
    end if;
    return '{}'::jsonb;
  else raise exception 'Unknown payment operation.';
  end if;
end $$;
