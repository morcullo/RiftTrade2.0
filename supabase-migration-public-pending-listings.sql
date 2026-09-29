-- Run in the Supabase SQL Editor to make pending listings visible in the marketplace.

drop policy if exists "Active listings are public" on public.listings;
drop policy if exists "Active and pending listings are public" on public.listings;
create policy "Active and pending listings are public" on public.listings
for select to anon, authenticated using (status in ('active', 'paused') or seller_id = auth.uid());

drop policy if exists "Listing cards follow visible listings" on public.listing_cards;
create policy "Listing cards follow visible listings" on public.listing_cards
for select to anon, authenticated using (
	exists (
		select 1 from public.listings
		where listings.id = listing_cards.listing_id
			and (listings.status in ('active', 'paused') or listings.seller_id = auth.uid())
	)
);