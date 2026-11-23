-- AETHER Gym: run this once in Supabase (SQL Editor > New query > paste > Run).

-- One row per saved item: the plan, each training day, each progress photo's details.
create table if not exists public.gym_docs (
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  path       text        not null,
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, path)
);

alter table public.gym_docs enable row level security;

drop policy if exists "own rows: read"   on public.gym_docs;
drop policy if exists "own rows: add"    on public.gym_docs;
drop policy if exists "own rows: change" on public.gym_docs;
drop policy if exists "own rows: remove" on public.gym_docs;
create policy "own rows: read"   on public.gym_docs for select to authenticated using (auth.uid() = user_id);
create policy "own rows: add"    on public.gym_docs for insert to authenticated with check (auth.uid() = user_id);
create policy "own rows: change" on public.gym_docs for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows: remove" on public.gym_docs for delete to authenticated using (auth.uid() = user_id);

-- live updates between a person's own devices
alter table public.gym_docs replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.gym_docs;
exception when duplicate_object then null; end $$;

-- private storage for progress photos: each person can only touch the folder named after their own id
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gym-photos', 'gym-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "own photos: read"   on storage.objects;
drop policy if exists "own photos: add"    on storage.objects;
drop policy if exists "own photos: remove" on storage.objects;
create policy "own photos: read"   on storage.objects for select to authenticated
  using (bucket_id = 'gym-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos: add"    on storage.objects for insert to authenticated
  with check (bucket_id = 'gym-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos: remove" on storage.objects for delete to authenticated
  using (bucket_id = 'gym-photos' and (storage.foldername(name))[1] = auth.uid()::text);
