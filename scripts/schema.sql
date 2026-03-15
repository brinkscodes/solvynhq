-- =============================================================
-- SolvynHQ Supabase Schema (Master Reference)
-- Paste this into Supabase SQL Editor and run it once.
-- =============================================================

-- HELPER: Get all project IDs a user is a member of
create or replace function user_project_ids()
returns setof uuid as $$
  select project_id from project_members where user_id = auth.uid()
$$ language sql security definer stable;

-- 1. PROFILES (auto-created on signup via trigger)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  last_seen_at timestamptz,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read profiles"
  on profiles for select using (auth.uid() is not null);

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

create policy "Members can read projects"
  on projects for select using (id in (select user_project_ids()));

create policy "Users can insert own projects"
  on projects for insert with check (auth.uid() = owner_id);

create policy "Members can update projects"
  on projects for update using (id in (select user_project_ids()));

-- Auto-add owner as member on project creation
create or replace function public.handle_new_project()
returns trigger as $$
begin
  insert into project_members (project_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (project_id, user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_project_created on projects;
create trigger on_project_created
  after insert on projects
  for each row execute function public.handle_new_project();

-- 3. PROJECT MEMBERS
create table if not exists project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  invited_by uuid references auth.users on delete set null,
  joined_at timestamptz default now(),
  unique (project_id, user_id)
);

alter table project_members enable row level security;

create policy "Members can read project_members"
  on project_members for select using (project_id in (select user_project_ids()));

create policy "Admins can insert project_members"
  on project_members for insert with check (project_id in (select user_project_ids()));

create policy "Admins can update project_members"
  on project_members for update using (project_id in (select user_project_ids()));

create policy "Admins can delete project_members"
  on project_members for delete using (project_id in (select user_project_ids()));

-- 4. PROJECT INVITES
create table if not exists project_invites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  invite_code text not null unique default encode(gen_random_bytes(16), 'hex'),
  email text,
  invited_by uuid not null references auth.users on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz default now()
);

alter table project_invites enable row level security;

create policy "Members can read project_invites"
  on project_invites for select using (project_id in (select user_project_ids()));

create policy "Anyone can read invites by code"
  on project_invites for select using (auth.uid() is not null);

create policy "Admins can insert project_invites"
  on project_invites for insert with check (project_id in (select user_project_ids()));

create policy "Admins can update project_invites"
  on project_invites for update using (project_id in (select user_project_ids()));

create policy "Admins can delete project_invites"
  on project_invites for delete using (project_id in (select user_project_ids()));

-- 5. SECTIONS (composite PK: id + project_id)
create table if not exists sections (
  id text not null,
  project_id uuid not null references projects on delete cascade,
  name text not null,
  "order" int not null default 0,
  phase int not null default 1 check (phase in (1, 2, 3)),
  primary key (id, project_id)
);

alter table sections enable row level security;

create policy "Members can read sections"
  on sections for select using (project_id in (select user_project_ids()));

create policy "Members can insert sections"
  on sections for insert with check (project_id in (select user_project_ids()));

create policy "Members can update sections"
  on sections for update using (project_id in (select user_project_ids()));

create policy "Members can delete sections"
  on sections for delete using (project_id in (select user_project_ids()));

-- 6. TASKS (composite PK: id + project_id)
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
  today_focus boolean default false,
  today_order int default 0,
  subtasks jsonb,
  assignee_id uuid references auth.users on delete set null,
  created_at timestamptz default now(),
  primary key (id, project_id),
  foreign key (section_id, project_id) references sections(id, project_id) on delete cascade
);

alter table tasks enable row level security;

create policy "Members can read tasks"
  on tasks for select using (project_id in (select user_project_ids()));

create policy "Members can insert tasks"
  on tasks for insert with check (project_id in (select user_project_ids()));

create policy "Members can update tasks"
  on tasks for update using (project_id in (select user_project_ids()));

create policy "Members can delete tasks"
  on tasks for delete using (project_id in (select user_project_ids()));

-- 7. NOTES (one row per project)
create table if not exists notes (
  project_id uuid primary key references projects on delete cascade,
  content text default '',
  updated_at timestamptz default now()
);

alter table notes enable row level security;

create policy "Members can read notes"
  on notes for select using (project_id in (select user_project_ids()));

create policy "Members can insert notes"
  on notes for insert with check (project_id in (select user_project_ids()));

create policy "Members can update notes"
  on notes for update using (project_id in (select user_project_ids()));

-- 8. COMMENTS (section comments, one per section per project)
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  section_id text not null,
  comment text not null default '',
  updated_at timestamptz default now(),
  unique (project_id, section_id)
);

alter table comments enable row level security;

create policy "Members can read comments"
  on comments for select using (project_id in (select user_project_ids()));

create policy "Members can insert comments"
  on comments for insert with check (project_id in (select user_project_ids()));

create policy "Members can update comments"
  on comments for update using (project_id in (select user_project_ids()));

create policy "Members can delete comments"
  on comments for delete using (project_id in (select user_project_ids()));

-- 9. TASK COMMENTS (per-task threaded comments)
create table if not exists task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id text not null,
  project_id uuid not null references projects on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  content text not null,
  mentions uuid[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_task_comments_task on task_comments(task_id, project_id);

alter table task_comments enable row level security;

create policy "Members can read task_comments"
  on task_comments for select using (project_id in (select user_project_ids()));

create policy "Members can insert task_comments"
  on task_comments for insert with check (project_id in (select user_project_ids()));

create policy "Users can update own task_comments"
  on task_comments for update using (user_id = auth.uid());

create policy "Users can delete own task_comments"
  on task_comments for delete using (user_id = auth.uid());

-- 10. COMMENT REACTIONS
create table if not exists comment_reactions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references task_comments on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  emoji text not null,
  created_at timestamptz default now(),
  unique (comment_id, user_id, emoji)
);

alter table comment_reactions enable row level security;

create policy "Members can read comment_reactions"
  on comment_reactions for select
  using (comment_id in (select id from task_comments where project_id in (select user_project_ids())));

create policy "Members can insert comment_reactions"
  on comment_reactions for insert
  with check (comment_id in (select id from task_comments where project_id in (select user_project_ids())));

create policy "Users can delete own comment_reactions"
  on comment_reactions for delete using (user_id = auth.uid());

-- 11. PRODUCT_CONTEXT (JSONB)
create table if not exists product_context (
  project_id uuid primary key references projects on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table product_context enable row level security;

create policy "Members can read product_context"
  on product_context for select using (project_id in (select user_project_ids()));

create policy "Members can insert product_context"
  on product_context for insert with check (project_id in (select user_project_ids()));

create policy "Members can update product_context"
  on product_context for update using (project_id in (select user_project_ids()));

-- 12. FEEDBACK (any authenticated user can submit)
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

-- 13. FORM SUBMISSIONS (from Elementor webhooks)
create table if not exists form_submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  form_name text not null default 'Unknown Form',
  fields jsonb not null default '{}',
  meta jsonb default '{}',
  status text not null default 'new' check (status in ('new', 'read', 'archived', 'test')),
  created_at timestamptz default now()
);

create index if not exists idx_form_submissions_project on form_submissions(project_id, created_at desc);

alter table form_submissions enable row level security;

create policy "Members can read form_submissions"
  on form_submissions for select using (project_id in (select user_project_ids()));

create policy "Members can update form_submissions"
  on form_submissions for update using (project_id in (select user_project_ids()));
