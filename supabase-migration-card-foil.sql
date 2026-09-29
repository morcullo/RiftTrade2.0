alter table public.listing_cards add column if not exists foil text not null default 'non_foil';
alter table public.listing_cards drop constraint if exists listing_cards_foil_check;
alter table public.listing_cards add constraint listing_cards_foil_check check (foil in ('foil', 'non_foil'));
