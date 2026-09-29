-- Expose the aggregate metrics used by the public home page without exposing completed listing rows.
create or replace function public.get_public_stats()
returns table(cards_listed bigint, active_traders bigint, trades_completed bigint)
language sql
security definer
set search_path = public
as $$
  select
    coalesce((
      select sum(listing_cards.quantity)::bigint
      from public.listing_cards
      join public.listings on listings.id = listing_cards.listing_id
      where listings.status = 'active'
    ), 0),
    (select count(*)::bigint from public.profiles),
    (select count(*)::bigint from public.listings where status = 'completed');
$$;

revoke all on function public.get_public_stats() from public;
grant execute on function public.get_public_stats() to anon, authenticated;