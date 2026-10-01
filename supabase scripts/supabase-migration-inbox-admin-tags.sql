-- Run in the Supabase SQL Editor after the admin and direct messaging migrations.

drop function if exists public.list_direct_conversations();

create function public.list_direct_conversations()
returns table (
  conversation_id uuid,
  peer_id uuid,
  peer_display_name text,
  peer_avatar_url text,
  peer_is_admin boolean,
  last_message_body text,
  last_message_at timestamptz,
  unread_count bigint
) language sql stable security definer set search_path = public as $$
  select
    conversation.id,
    peer.id,
    coalesce(peer.display_name, peer.username, 'RiftTrade member'),
    peer.avatar_url,
    exists (select 1 from public.admin_users administrator where administrator.id = peer.id),
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

revoke all on function public.list_direct_conversations() from public;
grant execute on function public.list_direct_conversations() to authenticated;
