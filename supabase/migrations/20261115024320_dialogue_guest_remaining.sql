create function public.dialogue_guest_remaining(p_guest_hash text)
returns integer
language sql stable security definer
set search_path = ''
as $$
  select 10 - coalesce(
    (select used from dialogue.guests where token_hash = p_guest_hash),
    0
  );
$$;

revoke all on function public.dialogue_guest_remaining(text) from public, anon, authenticated;
grant execute on function public.dialogue_guest_remaining(text) to service_role;
