-- Run in the Supabase SQL Editor after the admin and direct messaging migrations.

create or replace function public.admin_cancel_listing(
  target_listing_id uuid,
  cancellation_reason text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  listing_seller_id uuid;
  conversation_id uuid;
  first_participant uuid;
  second_participant uuid;
  reason text := btrim(cancellation_reason);
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if reason is null or char_length(reason) = 0 then
    raise exception 'A cancellation reason is required' using errcode = '22023';
  end if;

  select seller_id into listing_seller_id
  from public.listings
  where id = target_listing_id
  for update;

  if listing_seller_id is null then
    raise exception 'Listing not found' using errcode = 'P0002';
  end if;

  update public.listings
  set status = 'cancelled'
  where id = target_listing_id;

  first_participant := least(auth.uid(), listing_seller_id);
  second_participant := greatest(auth.uid(), listing_seller_id);
  insert into public.direct_conversations (participant_one, participant_two)
  values (first_participant, second_participant)
  on conflict (participant_one, participant_two) do nothing;

  select id into conversation_id
  from public.direct_conversations
  where participant_one = first_participant and participant_two = second_participant;

  insert into public.direct_messages (conversation_id, sender_id, body, shared_listing_id)
  values (
    conversation_id,
    auth.uid(),
    'This listing has been cancelled by an administrator.' || E'\n\nReason: ' || reason,
    target_listing_id
  );
end;
$$;

revoke all on function public.admin_cancel_listing(uuid, text) from public;
grant execute on function public.admin_cancel_listing(uuid, text) to authenticated;