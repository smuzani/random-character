-- Retire payment entry points; retain historical records without exposing them.
drop function public.dialogue_payments(text,jsonb);
drop function public.dialogue_service(text,jsonb);
alter function dialogue.dialogue_service_before_payments(text,jsonb) set schema public;
alter function public.dialogue_service_before_payments(text,jsonb) rename to dialogue_service;
revoke all on function public.dialogue_service(text,jsonb) from public, anon, authenticated;
grant execute on function public.dialogue_service(text,jsonb) to service_role;
update dialogue.credit_packs set enabled = false;
