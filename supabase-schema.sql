-- RiftTrade Supabase data model. Run in the Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  email text,
  discord_id text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_display_name_unique_idx
  on public.profiles (lower(btrim(display_name)))
  where display_name is not null and btrim(display_name) <> '';

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), new.email), new.email);
  return new;
end;
$$;

create or replace function public.handle_updated_user_email()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated after update of email on auth.users
for each row when (old.email is distinct from new.email) execute procedure public.handle_updated_user_email();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.cards (
  id text primary key,
  name text not null,
  code text,
  public_code text,
  set_code text,
  set_name text,
  collector_number integer,
  rarity text,
  type text,
  cost integer,
  might integer,
  power integer,
  domains text[] not null default '{}',
  tags text[] not null default '{}',
  ability_text text,
  artists text[] not null default '{}',
  orientation text,
  image_file text,
  image_path text,
  image_url text,
  is_alternate_art boolean not null default false,
  is_signed boolean not null default false,
  is_overnumbered boolean not null default false,
  is_variant boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  listing_type text not null default 'trade' check (listing_type in ('trade', 'sale', 'trade_or_sale', 'buy')),
  price numeric(10, 2) check (price is null or price >= 0),
  currency text not null default 'USD',
  status text not null default 'active' check (status in ('draft', 'active', 'paused', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_cards (
  listing_id uuid not null references public.listings(id) on delete cascade,
  card_id text not null references public.cards(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  condition text not null default 'near_mint' check (condition in ('near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged')),
  price numeric(10, 2) check (price is null or price >= 0),
  language text not null default 'English',
  foil text not null default 'non_foil' check (foil in ('foil', 'non_foil')),
  notes text,
  primary key (listing_id, card_id)
);

alter table public.listing_cards add column if not exists price numeric(10, 2) check (price is null or price >= 0);
alter table public.listing_cards add column if not exists foil text not null default 'non_foil';
alter table public.listing_cards drop constraint if exists listing_cards_foil_check;
alter table public.listing_cards add constraint listing_cards_foil_check check (foil in ('foil', 'non_foil'));

create index if not exists cards_name_search_idx on public.cards using gin (to_tsvector('simple', name));
create index if not exists cards_set_code_idx on public.cards (set_code);
create index if not exists listings_status_created_idx on public.listings (status, created_at desc);
create index if not exists listings_seller_idx on public.listings (seller_id);
create index if not exists listing_cards_card_idx on public.listing_cards (card_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at before update on public.listings for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.listings enable row level security;
alter table public.listing_cards enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable" on public.profiles for select to anon, authenticated using (true);
drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Anyone can read cards" on public.cards;
create policy "Anyone can read cards" on public.cards for select to anon, authenticated using (true);

drop policy if exists "Active listings are public" on public.listings;
drop policy if exists "Active and pending listings are public" on public.listings;
create policy "All listings are public" on public.listings for select to anon, authenticated using (true);
drop policy if exists "Users can create listings" on public.listings;
create policy "Users can create listings" on public.listings for insert to authenticated with check (seller_id = auth.uid());
drop policy if exists "Owners can update listings" on public.listings;
create policy "Owners can update listings" on public.listings for update to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
drop policy if exists "Owners can delete listings" on public.listings;
create policy "Owners can delete listings" on public.listings for delete to authenticated using (seller_id = auth.uid());

drop policy if exists "Listing cards follow visible listings" on public.listing_cards;
create policy "Listing cards follow visible listings" on public.listing_cards for select to anon, authenticated using (
  exists (select 1 from public.listings where listings.id = listing_cards.listing_id)
);
drop policy if exists "Owners can manage listing cards" on public.listing_cards;
create policy "Owners can manage listing cards" on public.listing_cards for all to authenticated using (
  exists (select 1 from public.listings where listings.id = listing_cards.listing_id and listings.seller_id = auth.uid())
) with check (
  exists (select 1 from public.listings where listings.id = listing_cards.listing_id and listings.seller_id = auth.uid())
);

insert into storage.buckets (id, name, public) values ('card-images', 'card-images', true)
on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public) values ('profile-images', 'profile-images', true)
on conflict (id) do update set public = true;
drop policy if exists "Anyone can read card images" on storage.objects;
create policy "Anyone can read card images" on storage.objects for select to anon, authenticated using (bucket_id = 'card-images');
drop policy if exists "Anyone can read profile images" on storage.objects;
create policy "Anyone can read profile images" on storage.objects for select to anon, authenticated using (bucket_id = 'profile-images');
drop policy if exists "Users can upload profile images" on storage.objects;
create policy "Users can upload profile images" on storage.objects for insert to authenticated with check (bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Users can update profile images" on storage.objects;
create policy "Users can update profile images" on storage.objects for update to authenticated using (bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Users can delete profile images" on storage.objects;
create policy "Users can delete profile images" on storage.objects for delete to authenticated using (bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text);

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