create extension if not exists pgcrypto;

create table if not exists public.athletes (
  id uuid primary key,
  name text not null,
  birth_year integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.session_logs (
  id text primary key,
  athlete_id uuid not null references public.athletes(id),
  scheduled_session_id text not null,
  session_date date not null,
  title text not null,
  status text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  schema_version integer not null,
  app_version text not null,
  plan_version text not null,
  device_id text not null,
  source text not null,
  session_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists session_logs_athlete_completed_idx
  on public.session_logs (athlete_id, completed_at desc);

create table if not exists public.session_progress (
  id text primary key,
  athlete_id uuid not null references public.athletes(id),
  workout_id text not null,
  session_date date,
  status text not null,
  current_step integer,
  started_at timestamptz,
  completed_at timestamptz,
  session_data jsonb not null,
  device_id text,
  schema_version integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists session_progress_athlete_workout_idx
  on public.session_progress (athlete_id, workout_id, updated_at desc);

alter table public.athletes enable row level security;
alter table public.session_logs enable row level security;
alter table public.session_progress enable row level security;

-- Phase 1 is a private single-family app without authentication.
-- These policies permit the anon client to access only the stable Maddox athlete.
create policy "anon can read Maddox athlete"
  on public.athletes for select to anon
  using (id = '00000000-0000-4000-8000-000000000012');

create policy "anon can insert Maddox athlete"
  on public.athletes for insert to anon
  with check (id = '00000000-0000-4000-8000-000000000012');

create policy "anon can update Maddox athlete"
  on public.athletes for update to anon
  using (id = '00000000-0000-4000-8000-000000000012')
  with check (id = '00000000-0000-4000-8000-000000000012');

create policy "anon can read Maddox session logs"
  on public.session_logs for select to anon
  using (athlete_id = '00000000-0000-4000-8000-000000000012');

create policy "anon can insert Maddox session logs"
  on public.session_logs for insert to anon
  with check (athlete_id = '00000000-0000-4000-8000-000000000012');

create policy "anon can read Maddox session progress"
  on public.session_progress for select to anon
  using (athlete_id = '00000000-0000-4000-8000-000000000012');

create policy "anon can insert Maddox session progress"
  on public.session_progress for insert to anon
  with check (athlete_id = '00000000-0000-4000-8000-000000000012');

create policy "anon can update Maddox session progress"
  on public.session_progress for update to anon
  using (athlete_id = '00000000-0000-4000-8000-000000000012')
  with check (athlete_id = '00000000-0000-4000-8000-000000000012');

-- Non-destructive API grants for projects with automatic table exposure off.
-- session_logs is immutable history: select/insert only, no update/delete grants.
grant usage on schema public to anon;
grant select, insert, update on table public.athletes to anon;
grant select, insert on table public.session_logs to anon;
grant select, insert, update on table public.session_progress to anon;
