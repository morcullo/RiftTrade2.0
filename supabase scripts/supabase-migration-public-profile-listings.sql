-- Run in the Supabase SQL Editor to show all member listings, including sold listings, on profiles.

drop policy if exists "Active listings are public" on public.listings;
drop policy if exists "Active and pending listings are public" on public.listings;
drop policy if exists "All listings are public" on public.listings;
create policy "All listings are public" on public.listings
for select to anon, authenticated using (true);

drop policy if exists "Listing cards follow visible listings" on public.listing_cards;
create policy "Listing cards follow visible listings" on public.listing_cards
for select to anon, authenticated using (
  exists (select 1 from public.listings where listings.id = listing_cards.listing_id)
);