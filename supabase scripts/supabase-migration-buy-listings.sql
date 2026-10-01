-- Allow existing RiftTrade projects to create buying listings.

alter table public.listings drop constraint if exists listings_listing_type_check;
alter table public.listings
  add constraint listings_listing_type_check
  check (listing_type in ('trade', 'sale', 'trade_or_sale', 'buy'));
