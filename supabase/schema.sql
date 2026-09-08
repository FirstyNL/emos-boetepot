-- EMOS Boetepot — Supabase schema
-- Voer dit uit in de Supabase SQL editor van een nieuw (of bestaand) project.
-- Dit script is idempotent: je kunt het altijd opnieuw draaien (bv. na een
-- update van dit bestand) zonder dat het stukloopt op dingen die al bestaan.

-- ============================================================
-- 1. PROFILES
--    Eén rij per speler, gekoppeld aan auth.users. is_admin bepaalt
--    of iemand boetes mag uitdelen / afvinken als betaald.
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  avatar_emoji text default '⚽',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Kolommen die na de eerste versie van dit schema zijn toegevoegd:
-- deze regel voegt ze alsnog toe als de tabel al bestond.
alter table public.profiles add column if not exists avatar_url text;

alter table public.profiles enable row level security;

-- Iedereen die is ingelogd mag alle profielen zien (nodig voor het podium/leaderboard).
drop policy if exists "profiles zijn zichtbaar voor teamleden" on public.profiles;
create policy "profiles zijn zichtbaar voor teamleden"
  on public.profiles for select
  to authenticated
  using (true);

-- Spelers mogen alleen hun eigen naam/avatar aanpassen, nooit is_admin.
drop policy if exists "spelers mogen eigen profiel bewerken" on public.profiles;
create policy "spelers mogen eigen profiel bewerken"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and is_admin = (select is_admin from public.profiles where id = auth.uid()));

-- Nieuw account -> automatisch een profiel aanmaken.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. FINE_TYPES
--    Catalogus met veelvoorkomende, herkenbare boetes zodat de
--    admin-modal snel-select opties heeft.
-- ============================================================
create table if not exists public.fine_types (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  default_amount numeric(6,2) not null,
  emoji text default '🚩',
  sort_order int not null default 0
);

alter table public.fine_types enable row level security;

drop policy if exists "fine_types zijn zichtbaar voor teamleden" on public.fine_types;
create policy "fine_types zijn zichtbaar voor teamleden"
  on public.fine_types for select
  to authenticated
  using (true);

drop policy if exists "alleen admins beheren fine_types" on public.fine_types;
create policy "alleen admins beheren fine_types"
  on public.fine_types for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

insert into public.fine_types (label, default_amount, emoji, sort_order) values
  ('Te laat op training', 2.50, '⏰', 1),
  ('Te laat op wedstrijddag', 5.00, '🚨', 2),
  ('Telefoon in de kleedkamer', 2.00, '📱', 3),
  ('Trainingspak vergeten', 1.50, '👕', 4),
  ('Scheenbeschermers vergeten', 2.00, '🦵', 5),
  ('Gele kaart', 3.00, '🟨', 6),
  ('Rode kaart', 7.50, '🟥', 7),
  ('Aanvoerdersband vergeten', 2.50, '©️', 8),
  ('Afzeggen na dinsdag', 5.00, '🙅', 9),
  ('Verliezen op FIFA/EA FC van de bondscoach', 1.00, '🎮', 10)
on conflict do nothing;

-- ============================================================
-- 3. FINES
--    Eén rij per boete. created_by = admin die de boete uitdeelde.
--    paid/paid_at worden alleen door een admin gezet.
-- ============================================================
create table if not exists public.fines (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles (id) on delete cascade,
  fine_type_id uuid references public.fine_types (id) on delete set null,
  description text not null,
  amount numeric(6,2) not null check (amount > 0),
  paid boolean not null default false,
  paid_at timestamptz,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create index if not exists fines_player_id_idx on public.fines (player_id);
create index if not exists fines_created_at_idx on public.fines (created_at desc);

alter table public.fines enable row level security;

-- Iedereen ziet alle boetes (leaderboard + live feed zijn team-breed zichtbaar).
drop policy if exists "fines zijn zichtbaar voor teamleden" on public.fines;
create policy "fines zijn zichtbaar voor teamleden"
  on public.fines for select
  to authenticated
  using (true);

-- Alleen admins mogen boetes aanmaken.
drop policy if exists "alleen admins delen boetes uit" on public.fines;
create policy "alleen admins delen boetes uit"
  on public.fines for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin)
    and created_by = auth.uid()
  );

-- Alleen admins mogen boetes wijzigen (bv. afvinken als betaald).
drop policy if exists "alleen admins wijzigen boetes" on public.fines;
create policy "alleen admins wijzigen boetes"
  on public.fines for update
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

-- Alleen admins mogen boetes verwijderen.
drop policy if exists "alleen admins verwijderen boetes" on public.fines;
create policy "alleen admins verwijderen boetes"
  on public.fines for delete
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

-- ============================================================
-- 4. REALTIME
--    Zet 'fines' aan voor Supabase Realtime zodat de live feed
--    automatisch bijwerkt zonder handmatig te verversen.
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'fines'
  ) then
    alter publication supabase_realtime add table public.fines;
  end if;
end $$;

-- ============================================================
-- 5. AVATARS (Supabase Storage)
--    Elke speler moet een profielfoto uploaden. Bucket is publiek
--    leesbaar (foto's zijn geen gevoelige data), maar iedereen mag
--    alleen bestanden in zijn eigen map (avatars/<user_id>/...) zetten.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "avatars zijn publiek zichtbaar" on storage.objects;
create policy "avatars zijn publiek zichtbaar"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "spelers uploaden alleen eigen avatar" on storage.objects;
create policy "spelers uploaden alleen eigen avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "spelers overschrijven alleen eigen avatar" on storage.objects;
create policy "spelers overschrijven alleen eigen avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "spelers verwijderen alleen eigen avatar" on storage.objects;
create policy "spelers verwijderen alleen eigen avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 6. EERSTE ADMIN
--    Draai dit los, na registratie van de eerste gebruiker, om
--    hem/haar beheerder te maken:
--
--    update public.profiles set is_admin = true where id =
--      (select id from auth.users where email = 'trainer@emos.nl');
-- ============================================================
