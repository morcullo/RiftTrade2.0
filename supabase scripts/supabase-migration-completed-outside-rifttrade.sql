-- Run after the base schema and sale-confirmation migration.
-- External completions are completed listings, but do not count toward profile ranks.

alter table public.listings
  add column if not exists completed_outside_rifttrade boolean not null default false;

create or replace function public.complete_listing_outside_rifttrade(target_listing_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to complete a listing.' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.listings
    where id = target_listing_id
      and seller_id = auth.uid()
      and status <> 'completed'
  ) then
    raise exception 'This listing is unavailable for completion.' using errcode = '22023';
  end if;

  update public.listings
  set status = 'completed', completed_outside_rifttrade = true
  where id = target_listing_id and seller_id = auth.uid() and status <> 'completed';
  return target_listing_id;
end;
$$;

revoke all on function public.complete_listing_outside_rifttrade(uuid) from public;
grant execute on function public.complete_listing_outside_rifttrade(uuid) to authenticated;

create or replace function public.get_profile_completion_counts()
returns table(profile_id uuid, completed_count bigint)
language sql stable security definer set search_path = public as $$
  select profile_id, count(*)::bigint
  from (
    select listing.seller_id as profile_id
    from public.listings listing
    where listing.status = 'completed'
      and not listing.completed_outside_rifttrade
    union all
    select confirmation.buyer_id as profile_id
    from public.listing_sale_confirmations confirmation
    where confirmation.status = 'confirmed'
  ) completions
  group by profile_id;
$$;

revoke all on function public.get_profile_completion_counts() from public;
grant execute on function public.get_profile_completion_counts() to anon, authenticated;
