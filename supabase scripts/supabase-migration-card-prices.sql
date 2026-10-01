-- Add per-card pricing to existing RiftTrade databases.
alter table public.listing_cards
  add column if not exists price numeric(10, 2)
  check (price is null or price >= 0);
