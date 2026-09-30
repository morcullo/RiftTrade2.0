-- Run after supabase-migration-direct-messaging.sql to require buyer confirmation before a listing is sold.

create table if not exists public.listing_sale_confirmations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.direct_conversations(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'confirmed')),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  constraint listing_sale_confirmations_distinct_users check (seller_id <> buyer_id),
  constraint listing_sale_confirmations_unique_listing unique (listing_id)
);

alter table public.direct_messages
  add column if not exists sale_confirmation_id uuid references public.listing_sale_confirmations(id) on delete set null;

create index if not exists listing_sale_confirmations_buyer_idx on public.listing_sale_confirmations (buyer_id, status);
create index if not exists listing_sale_confirmations_seller_idx on public.listing_sale_confirmations (seller_id, status);

alter table public.listing_sale_confirmations enable row level security;
grant select on public.listing_sale_confirmations to authenticated;

drop policy if exists "Sale participants can read confirmations" on public.listing_sale_confirmations;
create policy "Sale participants can read confirmations" on public.listing_sale_confirmations
for select to authenticated using (auth.uid() = seller_id or auth.uid() = buyer_id);

create or replace function public.can_complete_listing(target_listing_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.listings listing
    join public.listing_sale_confirmations confirmation on confirmation.listing_id = listing.id
    where listing.id = target_listing_id
      and listing.seller_id = auth.uid()
      and listing.status <> 'completed'
      and confirmation.status = 'confirmed'
  );
$$;

revoke all on function public.can_complete_listing(uuid) from public;
grant execute on function public.can_complete_listing(uuid) to authenticated;

drop policy if exists "Owners can update listings" on public.listings;
create policy "Owners can update listings" on public.listings
for update to authenticated using (seller_id = auth.uid()) with check (
  seller_id = auth.uid()
  and (status <> 'completed' or public.can_complete_listing(id))
);

drop policy if exists "Participants can send messages as themselves" on public.direct_messages;
create policy "Participants can send messages as themselves" on public.direct_messages
for insert to authenticated with check (
  sender_id = auth.uid()
  and sale_confirmation_id is null
  and exists (
    select 1 from public.direct_conversations conversation
    where conversation.id = direct_messages.conversation_id
      and (auth.uid() = conversation.participant_one or auth.uid() = conversation.participant_two)
  )
  and (shared_listing_id is null or public.can_share_listing_in_direct_message(shared_listing_id))
);

create or replace function public.request_listing_sale_confirmation(target_listing_id uuid, target_buyer_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  current_user_id uuid := auth.uid();
  target_conversation_id uuid;
  confirmation_id uuid;
begin
  if current_user_id is null then
    raise exception 'Sign in to request sale confirmation.' using errcode = '42501';
  end if;
  if target_buyer_id is null or target_buyer_id = current_user_id then
    raise exception 'Choose another member as the buyer.' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.listings
    where id = target_listing_id and seller_id = current_user_id and status <> 'completed'
  ) then
    raise exception 'This listing is unavailable for sale confirmation.' using errcode = '22023';
  end if;
  select conversation.id into target_conversation_id
  from public.direct_conversations conversation
  where conversation.participant_one = least(current_user_id, target_buyer_id)
    and conversation.participant_two = greatest(current_user_id, target_buyer_id)
    and exists (
      select 1 from public.direct_messages message
      where message.conversation_id = conversation.id
    );
  if target_conversation_id is null then
    raise exception 'Choose a member from an existing conversation.' using errcode = '22023';
  end if;
  if exists (select 1 from public.listing_sale_confirmations where listing_id = target_listing_id) then
    raise exception 'A sale confirmation has already been requested for this listing.' using errcode = '23505';
  end if;

  insert into public.listing_sale_confirmations (listing_id, seller_id, buyer_id, conversation_id)
  values (target_listing_id, current_user_id, target_buyer_id, target_conversation_id)
  returning id into confirmation_id;

  insert into public.direct_messages (conversation_id, sender_id, body, shared_listing_id, sale_confirmation_id)
  values (
    target_conversation_id,
    current_user_id,
    'Sale confirmation requested. Please confirm that you bought this listing.',
    target_listing_id,
    confirmation_id
  );
  return confirmation_id;
end;
$$;

create or replace function public.confirm_listing_sale(target_confirmation_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  current_user_id uuid := auth.uid();
  confirmation public.listing_sale_confirmations;
begin
  if current_user_id is null then
    raise exception 'Sign in to confirm this sale.' using errcode = '42501';
  end if;
  select * into confirmation
  from public.listing_sale_confirmations
  where id = target_confirmation_id
  for update;
  if confirmation.id is null or confirmation.buyer_id <> current_user_id then
    raise exception 'This sale confirmation is not available to you.' using errcode = '42501';
  end if;
  if confirmation.status = 'confirmed' then return confirmation.listing_id; end if;
  if not exists (select 1 from public.listings where id = confirmation.listing_id and status <> 'completed') then
    raise exception 'This listing is no longer available for confirmation.' using errcode = '22023';
  end if;

  update public.listing_sale_confirmations
  set status = 'confirmed', confirmed_at = now()
  where id = confirmation.id;
  update public.listings
  set status = 'completed'
  where id = confirmation.listing_id and seller_id = confirmation.seller_id and status <> 'completed';
  return confirmation.listing_id;
end;
$$;

revoke all on function public.request_listing_sale_confirmation(uuid, uuid) from public;
revoke all on function public.confirm_listing_sale(uuid) from public;
grant execute on function public.request_listing_sale_confirmation(uuid, uuid) to authenticated;
grant execute on function public.confirm_listing_sale(uuid) to authenticated;