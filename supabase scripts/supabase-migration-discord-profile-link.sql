-- Run in the Supabase SQL Editor to add Discord contact links to member profiles.

alter table public.profiles add column if not exists discord_id text;

update public.profiles as profile
set discord_id = identity.provider_id
from auth.identities as identity
where identity.user_id = profile.id
  and identity.provider = 'discord'
  and profile.discord_id is distinct from identity.provider_id;

create or replace function public.sync_discord_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    if old.provider = 'discord' then
      update public.profiles
      set discord_id = null
      where id = old.user_id and discord_id = old.provider_id;
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE' and old.provider = 'discord'
    and (new.provider <> 'discord' or new.provider_id is distinct from old.provider_id) then
    update public.profiles
    set discord_id = null
    where id = old.user_id and discord_id = old.provider_id;
  end if;

  if new.provider = 'discord' then
    update public.profiles
    set discord_id = new.provider_id
    where id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_discord_identity_changed on auth.identities;
create trigger on_discord_identity_changed after insert or update or delete on auth.identities
for each row execute procedure public.sync_discord_profile();