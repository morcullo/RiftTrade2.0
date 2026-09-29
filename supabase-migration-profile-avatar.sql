-- Run in the Supabase SQL Editor to enable profile avatar uploads.

alter table public.profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can read profile images" on storage.objects;
create policy "Anyone can read profile images" on storage.objects
for select to anon, authenticated using (bucket_id = 'profile-images');

drop policy if exists "Users can upload profile images" on storage.objects;
create policy "Users can upload profile images" on storage.objects
for insert to authenticated with check (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update profile images" on storage.objects;
create policy "Users can update profile images" on storage.objects
for update to authenticated using (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = auth.uid()::text
) with check (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete profile images" on storage.objects;
create policy "Users can delete profile images" on storage.objects
for delete to authenticated using (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
