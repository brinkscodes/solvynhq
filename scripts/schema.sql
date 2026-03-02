-- =============================================================
-- SolvynHQ Supabase Schema
-- Paste this into Supabase SQL Editor and run it once.
-- =============================================================

-- 1. PROFILES (auto-created on signup via trigger)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. PROJECTS
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  name text not null default 'SolvynHQ',
  description text default '',
  created_at timestamptz default now()
);

alter table projects enable row level security;

create policy "Users can read own projects"
  on projects for select using (auth.uid() = owner_id);

create policy "Users can insert own projects"
  on projects for insert with check (auth.uid() = owner_id);

create policy "Users can update own projects"
  on projects for update using (auth.uid() = owner_id);

-- 3. SECTIONS (composite PK: id + project_id)
create table if not exists sections (
  id text not null,
  project_id uuid not null references projects on delete cascade,
  name text not null,
  "order" int not null default 0,
  phase int not null default 1 check (phase in (1, 2, 3)),
  primary key (id, project_id)
);

alter table sections enable row level security;

create policy "Users can read own sections"
  on sections for select
  using (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can insert own sections"
  on sections for insert
  with check (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can update own sections"
  on sections for update
  using (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can delete own sections"
  on sections for delete
  using (project_id in (select id from projects where owner_id = auth.uid()));

-- 4. TASKS (composite PK: id + project_id)
create table if not exists tasks (
  id text not null,
  project_id uuid not null references projects on delete cascade,
  section_id text not null,
  name text not null,
  description text default '',
  status text not null default 'todo' check (status in ('todo', 'in-progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  tag text not null default 'Config',
  completed_at timestamptz,
  created_at timestamptz default now(),
  primary key (id, project_id),
  foreign key (section_id, project_id) references sections(id, project_id) on delete cascade
);

alter table tasks enable row level security;

create policy "Users can read own tasks"
  on tasks for select
  using (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can insert own tasks"
  on tasks for insert
  with check (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can update own tasks"
  on tasks for update
  using (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can delete own tasks"
  on tasks for delete
  using (project_id in (select id from projects where owner_id = auth.uid()));

-- 5. NOTES (one row per project)
create table if not exists notes (
  project_id uuid primary key references projects on delete cascade,
  content text default '',
  updated_at timestamptz default now()
);

alter table notes enable row level security;

create policy "Users can read own notes"
  on notes for select
  using (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can insert own notes"
  on notes for insert
  with check (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can update own notes"
  on notes for update
  using (project_id in (select id from projects where owner_id = auth.uid()));

-- 6. COMMENTS (section comments, one per section per project)
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  section_id text not null,
  comment text not null default '',
  updated_at timestamptz default now(),
  unique (project_id, section_id)
);

alter table comments enable row level security;

create policy "Users can read own comments"
  on comments for select
  using (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can insert own comments"
  on comments for insert
  with check (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can update own comments"
  on comments for update
  using (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can delete own comments"
  on comments for delete
  using (project_id in (select id from projects where owner_id = auth.uid()));

-- 7. PRODUCT_CONTEXT (JSONB — deeply nested, normalizing adds complexity without benefit)
create table if not exists product_context (
  project_id uuid primary key references projects on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table product_context enable row level security;

create policy "Users can read own product_context"
  on product_context for select
  using (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can insert own product_context"
  on product_context for insert
  with check (project_id in (select id from projects where owner_id = auth.uid()));

create policy "Users can update own product_context"
  on product_context for update
  using (project_id in (select id from projects where owner_id = auth.uid()));

-- 8. FEEDBACK (no RLS — any authenticated user can submit)
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  message text not null,
  email_sent boolean default false,
  created_at timestamptz default now()
);

alter table feedback enable row level security;

create policy "Authenticated users can insert feedback"
  on feedback for insert
  with check (auth.uid() is not null);

create policy "Users can read own feedback"
  on feedback for select
  using (auth.uid() = user_id);
