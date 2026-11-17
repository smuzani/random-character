-- Run with psql variables: paddle_environment, paddle_price_id, pack_terms.
-- Use the real Paddle price ID and approved terms. This does not enable checkout.
\set ON_ERROR_STOP on
insert into dialogue.credit_packs
  (enabled, environment, price_id, amount, currency, credits, terms)
values
  (false, :'paddle_environment', :'paddle_price_id', 100, 'USD', 100, :'pack_terms')
returning id, enabled, environment, amount, currency, credits;
