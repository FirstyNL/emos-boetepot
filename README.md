# EMOS Boetepot

## Setup

1. Maak een Supabase-project aan.
2. Draai [`supabase/schema.sql`](supabase/schema.sql) in de Supabase SQL editor.
3. Kopieer `.env.local.example` naar `.env.local` en vul je Supabase URL + anon key in.
4. Registreer jezelf via de app, en maak jezelf admin:
   ```sql
   update public.profiles set is_admin = true where id =
     (select id from auth.users where email = 'jouw@email.nl');
   ```
5. Installeer en start:
   ```bash
   npm install
   npm run dev
   ```

## Wat zit erin

- **Auth**: e-mail/wachtwoord via Supabase Auth, profiel wordt automatisch aangemaakt.
- **Dashboard**: teamuitje-voortgangsbalk (doel €250, gebaseerd op betaalde boetes), week-podium met humoristische badges, statskaarten (pot totaal + eigen saldo + Tikkie-knop), live feed (realtime via Supabase Realtime).
- **Admin**: floating knop rechtsonder opent een modal om snel een boete uit te delen (met een catalogus aan standaardboetes), en kan boetes afvinken als betaald in de live feed.
- **RLS**: iedereen ziet alle profielen/boetes (nodig voor het leaderboard), maar alleen `is_admin = true`-gebruikers mogen boetes aanmaken/wijzigen/verwijderen.
