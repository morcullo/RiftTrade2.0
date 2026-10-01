-- Run in the Supabase SQL Editor to allow users to share any public listing in direct messages.

create or replace function public.can_share_listing_in_direct_message(target_listing_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and exists (
    select 1 from public.listings listing
    where listing.id = target_listing_id
  );
$$;

revoke all on function public.can_share_listing_in_direct_message(uuid) from public;
grant execute on function public.can_share_listing_in_direct_message(uuid) to authenticated;