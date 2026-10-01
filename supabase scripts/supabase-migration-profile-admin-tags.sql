-- Run in the Supabase SQL Editor after the admin migration.

create or replace function public.is_profile_admin(target_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = target_profile_id
  );
$$;

revoke all on function public.is_profile_admin(uuid) from public;
grant execute on function public.is_profile_admin(uuid) to anon, authenticated;