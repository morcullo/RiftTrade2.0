-- Run in the Supabase SQL Editor. Existing duplicate names keep the oldest account's name;
-- later accounts are renamed with a numbered suffix before uniqueness is enforced.

do $$
declare
  duplicate_profile record;
  base_name text;
  candidate text;
  suffix integer;
begin
  update public.profiles
  set display_name = nullif(btrim(display_name), '')
  where display_name is not null
    and display_name is distinct from nullif(btrim(display_name), '');

  for duplicate_profile in
    select id, display_name
    from (
      select
        id,
        display_name,
        row_number() over (partition by lower(btrim(display_name)) order by created_at, id) as duplicate_rank
      from public.profiles
      where display_name is not null and btrim(display_name) <> ''
    ) ranked_profiles
    where duplicate_rank > 1
    order by lower(btrim(display_name)), id
  loop
    base_name := btrim(duplicate_profile.display_name);
    suffix := 2;
    loop
      candidate := format('%s (%s)', base_name, suffix);
      exit when not exists (
        select 1
        from public.profiles existing_profile
        where existing_profile.id <> duplicate_profile.id
          and lower(btrim(existing_profile.display_name)) = lower(candidate)
      );
      suffix := suffix + 1;
    end loop;

    update public.profiles
    set display_name = candidate
    where id = duplicate_profile.id;
  end loop;
end;
$$;

create unique index if not exists profiles_display_name_unique_idx
  on public.profiles (lower(btrim(display_name)))
  where display_name is not null and btrim(display_name) <> '';

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), new.email));
  return new;
end;
$$;