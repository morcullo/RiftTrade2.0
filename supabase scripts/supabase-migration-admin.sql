-- RiftTrade administrator controls. Run in the Supabase SQL Editor.
-- This migration promotes mdorcullo@gmail.com if that Auth account already exists.

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('moderator', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.admin_users add column if not exists role text;
update public.admin_users set role = 'admin' where role is null;
alter table public.admin_users alter column role set default 'admin';
alter table public.admin_users alter column role set not null;
alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users add constraint admin_users_role_check check (role in ('moderator', 'admin'));

alter table public.profiles add column if not exists rank_override text;
alter table public.profiles drop constraint if exists profiles_rank_override_check;
alter table public.profiles add constraint profiles_rank_override_check check (
  rank_override is null or rank_override in ('Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger')
);

insert into public.admin_users (id)
select id from auth.users where lower(email) = lower('mdorcullo@gmail.com')
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$;

create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.admin_users where id = auth.uid()), 'user');
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;
revoke all on function public.get_my_role() from public;
grant execute on function public.get_my_role() to authenticated;

drop function if exists public.admin_update_profile(uuid, text, text);
create or replace function public.admin_update_profile(
  target_user_id uuid,
  new_display_name text,
  new_rank_override text default null,
  new_role text default 'user'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  if new_role not in ('user', 'moderator', 'admin') then raise exception 'Invalid privilege'; end if;
  if target_user_id = auth.uid() and new_role <> 'admin' then raise exception 'Administrators cannot remove their own administrator access'; end if;
  if new_rank_override is not null and new_rank_override not in ('Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger') then
    raise exception 'Invalid rank';
  end if;
  update public.profiles
  set display_name = nullif(btrim(new_display_name), ''), rank_override = new_rank_override
  where id = target_user_id;
  if new_role = 'user' then
    delete from public.admin_users where id = target_user_id;
  else
    insert into public.admin_users (id, role) values (target_user_id, new_role)
    on conflict (id) do update set role = excluded.role;
  end if;
end;
$$;

create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  if target_user_id = auth.uid() then raise exception 'Administrators cannot delete themselves'; end if;
  delete from auth.users where id = target_user_id;
end;
$$;

revoke all on function public.admin_update_profile(uuid, text, text, text) from public;
grant execute on function public.admin_update_profile(uuid, text, text, text) to authenticated;
revoke all on function public.admin_delete_user(uuid) from public;
grant execute on function public.admin_delete_user(uuid) to authenticated;

alter table public.admin_users enable row level security;
drop policy if exists "Administrators can read administrators" on public.admin_users;
create policy "Staff can read staff roles" on public.admin_users for select to authenticated using (public.is_staff());

drop policy if exists "Users can update their profile" on public.profiles;
drop policy if exists "Users and administrators can update profiles" on public.profiles;
create policy "Users and administrators can update profiles" on public.profiles for update to authenticated
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());
drop policy if exists "Administrators can delete profiles" on public.profiles;
create policy "Administrators can delete profiles" on public.profiles for delete to authenticated using (public.is_admin());

drop policy if exists "Owners can update listings" on public.listings;
drop policy if exists "Owners and administrators can update listings" on public.listings;
create policy "Owners and administrators can update listings" on public.listings for update to authenticated
using (seller_id = auth.uid() or public.is_admin())
with check (seller_id = auth.uid() or public.is_admin());
drop policy if exists "Owners can delete listings" on public.listings;
drop policy if exists "Owners and administrators can delete listings" on public.listings;
create policy "Owners and administrators can delete listings" on public.listings for delete to authenticated using (seller_id = auth.uid() or public.is_admin());

drop policy if exists "Owners can manage listing cards" on public.listing_cards;
drop policy if exists "Owners and administrators can manage listing cards" on public.listing_cards;
create policy "Owners and administrators can manage listing cards" on public.listing_cards for all to authenticated
using (exists (select 1 from public.listings where listings.id = listing_cards.listing_id and (listings.seller_id = auth.uid() or public.is_admin())))
with check (exists (select 1 from public.listings where listings.id = listing_cards.listing_id and (listings.seller_id = auth.uid() or public.is_admin())));

-- Admins may read private profile email values for account management.
drop policy if exists "Administrators can read profile emails" on public.profiles;
create policy "Administrators can read profile emails" on public.profiles for select to authenticated using (public.is_admin());

drop policy if exists "Administrators can update cards" on public.cards;
create policy "Administrators can update cards" on public.cards for update to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Administrators can delete cards" on public.cards;
create policy "Administrators can delete cards" on public.cards for delete to authenticated using (public.is_admin());
