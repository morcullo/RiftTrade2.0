-- Run or rerun in the Supabase SQL Editor to enable persistent one-to-one messaging and repair earlier recursive listing-sharing policies.

create table if not exists public.direct_conversations (
  id uuid primary key default gen_random_uuid(),
  participant_one uuid not null references auth.users(id) on delete cascade,
  participant_two uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  constraint direct_conversations_distinct_participants check (participant_one <> participant_two),
  constraint direct_conversations_ordered_participants check (participant_one < participant_two),
  constraint direct_conversations_unique_pair unique (participant_one, participant_two)
);

create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.direct_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 4000),
  shared_listing_id uuid references public.listings(id) on delete set null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

alter table public.direct_messages add column if not exists shared_listing_id uuid references public.listings(id) on delete set null;

create index if not exists direct_conversations_participant_one_idx on public.direct_conversations (participant_one, last_message_at desc);
create index if not exists direct_conversations_participant_two_idx on public.direct_conversations (participant_two, last_message_at desc);
create index if not exists direct_messages_conversation_created_idx on public.direct_messages (conversation_id, created_at desc);

alter table public.direct_conversations enable row level security;
alter table public.direct_messages enable row level security;

grant select on public.direct_conversations to authenticated;
grant select, insert on public.direct_messages to authenticated;

create or replace function public.can_share_listing_in_direct_message(target_listing_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and exists (
    select 1 from public.listings listing
    where listing.id = target_listing_id
  );
$$;

create or replace function public.can_view_shared_direct_listing(target_listing_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and exists (
    select 1
    from public.direct_messages message
    join public.direct_conversations conversation on conversation.id = message.conversation_id
    where message.shared_listing_id = target_listing_id
      and (auth.uid() = conversation.participant_one or auth.uid() = conversation.participant_two)
  );
$$;

revoke all on function public.can_share_listing_in_direct_message(uuid) from public;
revoke all on function public.can_view_shared_direct_listing(uuid) from public;
grant execute on function public.can_share_listing_in_direct_message(uuid) to authenticated;
grant execute on function public.can_view_shared_direct_listing(uuid) to anon, authenticated;

drop policy if exists "Conversation participants can read conversations" on public.direct_conversations;
create policy "Conversation participants can read conversations" on public.direct_conversations
for select to authenticated using (auth.uid() = participant_one or auth.uid() = participant_two);

drop policy if exists "Conversation participants can read messages" on public.direct_messages;
create policy "Conversation participants can read messages" on public.direct_messages
for select to authenticated using (
  exists (
    select 1 from public.direct_conversations conversation
    where conversation.id = direct_messages.conversation_id
      and (auth.uid() = conversation.participant_one or auth.uid() = conversation.participant_two)
  )
);

drop policy if exists "Participants can send messages as themselves" on public.direct_messages;
create policy "Participants can send messages as themselves" on public.direct_messages
for insert to authenticated with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.direct_conversations conversation
    where conversation.id = direct_messages.conversation_id
      and (auth.uid() = conversation.participant_one or auth.uid() = conversation.participant_two)
  )
  and (shared_listing_id is null or public.can_share_listing_in_direct_message(shared_listing_id))
);

drop policy if exists "Conversation participants can view shared listings" on public.listings;
create policy "Conversation participants can view shared listings" on public.listings
for select to authenticated using (public.can_view_shared_direct_listing(id));

drop policy if exists "Listing cards follow visible listings" on public.listing_cards;
create policy "Listing cards follow visible listings" on public.listing_cards
for select to anon, authenticated using (
  exists (select 1 from public.listings where listings.id = listing_cards.listing_id)
);

create or replace function public.get_or_create_direct_conversation(target_user_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  current_user_id uuid := auth.uid();
  first_participant uuid;
  second_participant uuid;
  conversation_id uuid;
begin
  if current_user_id is null then
    raise exception 'Sign in to start a conversation.' using errcode = '42501';
  end if;
  if target_user_id is null or target_user_id = current_user_id then
    raise exception 'Choose another member to message.' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles where id = target_user_id) then
    raise exception 'This member profile is unavailable.' using errcode = '22023';
  end if;

  first_participant := least(current_user_id, target_user_id);
  second_participant := greatest(current_user_id, target_user_id);
  insert into public.direct_conversations (participant_one, participant_two)
  values (first_participant, second_participant)
  on conflict (participant_one, participant_two) do nothing;

  select id into conversation_id
  from public.direct_conversations
  where participant_one = first_participant and participant_two = second_participant;
  return conversation_id;
end;
$$;

create or replace function public.list_direct_conversations()
returns table (
  conversation_id uuid,
  peer_id uuid,
  peer_display_name text,
  peer_avatar_url text,
  last_message_body text,
  last_message_at timestamptz,
  unread_count bigint
) language sql stable security definer set search_path = public as $$
  select
    conversation.id,
    peer.id,
    coalesce(peer.display_name, peer.username, 'RiftTrade member'),
    peer.avatar_url,
    latest_message.body,
    coalesce(latest_message.created_at, conversation.last_message_at),
    coalesce(unread_messages.unread_count, 0)::bigint
  from public.direct_conversations conversation
  join public.profiles peer on peer.id = case
    when conversation.participant_one = auth.uid() then conversation.participant_two
    else conversation.participant_one
  end
  left join lateral (
    select message.body, message.created_at
    from public.direct_messages message
    where message.conversation_id = conversation.id
    order by message.created_at desc, message.id desc
    limit 1
  ) latest_message on true
  left join lateral (
    select count(*) as unread_count
    from public.direct_messages message
    where message.conversation_id = conversation.id
      and message.sender_id <> auth.uid()
      and message.read_at is null
  ) unread_messages on true
  where auth.uid() = conversation.participant_one or auth.uid() = conversation.participant_two
  order by coalesce(latest_message.created_at, conversation.last_message_at) desc;
$$;

create or replace function public.mark_direct_conversation_read(target_conversation_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.direct_conversations conversation
    where conversation.id = target_conversation_id
      and (auth.uid() = conversation.participant_one or auth.uid() = conversation.participant_two)
  ) then
    raise exception 'Conversation not found.' using errcode = '42501';
  end if;

  update public.direct_messages
  set read_at = now()
  where conversation_id = target_conversation_id
    and sender_id <> auth.uid()
    and read_at is null;
end;
$$;

create or replace function public.bump_direct_conversation_activity()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.direct_conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists direct_messages_bump_conversation on public.direct_messages;
create trigger direct_messages_bump_conversation after insert on public.direct_messages
for each row execute procedure public.bump_direct_conversation_activity();

revoke all on function public.get_or_create_direct_conversation(uuid) from public;
revoke all on function public.list_direct_conversations() from public;
revoke all on function public.mark_direct_conversation_read(uuid) from public;
grant execute on function public.get_or_create_direct_conversation(uuid) to authenticated;
grant execute on function public.list_direct_conversations() to authenticated;
grant execute on function public.mark_direct_conversation_read(uuid) to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'direct_messages'
    ) then
    execute 'alter publication supabase_realtime add table public.direct_messages';
  end if;
end;
$$;
