-- Run in the Supabase SQL Editor after the admin and direct messaging migrations.

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  details text not null check (char_length(trim(details)) between 10 and 4000),
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  constraint reports_target_check check (reported_user_id is not null or listing_id is not null)
);

create index if not exists reports_created_at_idx on public.reports (created_at desc);
create index if not exists reports_reported_user_idx on public.reports (reported_user_id);
create index if not exists reports_listing_idx on public.reports (listing_id);

alter table public.reports enable row level security;
grant select, insert on public.reports to authenticated;
grant update on public.reports to authenticated;

drop policy if exists "Users can submit reports" on public.reports;
create policy "Users can submit reports" on public.reports
for insert to authenticated
with check (reporter_id = auth.uid());

drop policy if exists "Users can read their reports" on public.reports;
create policy "Users can read their reports" on public.reports
for select to authenticated
using (reporter_id = auth.uid() or public.is_staff());

drop policy if exists "Administrators can update reports" on public.reports;
create policy "Administrators can update reports" on public.reports
for update to authenticated
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Administrators can read direct messages" on public.direct_messages;
create policy "Administrators can read direct messages" on public.direct_messages
for select to authenticated
using (public.is_staff());

drop policy if exists "Administrators can read conversations" on public.direct_conversations;
create policy "Administrators can read conversations" on public.direct_conversations
for select to authenticated
using (public.is_staff());
