-- =============================================================
-- Team Collaboration Migration (idempotent — safe to re-run)
-- Run this in Supabase SQL Editor after the base schema.
-- =============================================================

-- 1. PROJECT MEMBERS
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

-- 2. PROJECT INVITES
create table if not exists project_invites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  invite_code text not null unique default encode(gen_random_bytes(16), 'hex'),
  email text, -- null = open link invite
  invited_by uuid not null references auth.users on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz default now()
);

alter table project_invites enable row level security;

-- 3. TASK COMMENTS (per-task threaded comments)
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

-- 4. COMMENT REACTIONS
create table if not exists comment_reactions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references task_comments on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  emoji text not null,
  created_at timestamptz default now(),
  unique (comment_id, user_id, emoji)
);

alter table comment_reactions enable row level security;

-- 5. ADD ASSIGNEE TO TASKS
alter table tasks add column if not exists assignee_id uuid references auth.users on delete set null;

-- =============================================================
-- HELPER FUNCTION: Get all project IDs a user is a member of
-- =============================================================
create or replace function user_project_ids()
returns setof uuid as $$
  select project_id from project_members where user_id = auth.uid()
$$ language sql security definer stable;

-- =============================================================
-- DROP ALL OLD + NEW POLICIES (makes this fully idempotent)
-- =============================================================

-- Projects
drop policy if exists "Users can read own projects" on projects;
drop policy if exists "Users can insert own projects" on projects;
drop policy if exists "Users can update own projects" on projects;
drop policy if exists "Members can read projects" on projects;
drop policy if exists "Members can update projects" on projects;

-- Sections
drop policy if exists "Users can read own sections" on sections;
drop policy if exists "Users can insert own sections" on sections;
drop policy if exists "Users can update own sections" on sections;
drop policy if exists "Users can delete own sections" on sections;
drop policy if exists "Members can read sections" on sections;
drop policy if exists "Members can insert sections" on sections;
drop policy if exists "Members can update sections" on sections;
drop policy if exists "Members can delete sections" on sections;

-- Tasks
drop policy if exists "Users can read own tasks" on tasks;
drop policy if exists "Users can insert own tasks" on tasks;
drop policy if exists "Users can update own tasks" on tasks;
drop policy if exists "Users can delete own tasks" on tasks;
drop policy if exists "Members can read tasks" on tasks;
drop policy if exists "Members can insert tasks" on tasks;
drop policy if exists "Members can update tasks" on tasks;
drop policy if exists "Members can delete tasks" on tasks;

-- Notes
drop policy if exists "Users can read own notes" on notes;
drop policy if exists "Users can insert own notes" on notes;
drop policy if exists "Users can update own notes" on notes;
drop policy if exists "Members can read notes" on notes;
drop policy if exists "Members can insert notes" on notes;
drop policy if exists "Members can update notes" on notes;

-- Comments (section comments)
drop policy if exists "Users can read own comments" on comments;
drop policy if exists "Users can insert own comments" on comments;
drop policy if exists "Users can update own comments" on comments;
drop policy if exists "Users can delete own comments" on comments;
drop policy if exists "Members can read comments" on comments;
drop policy if exists "Members can insert comments" on comments;
drop policy if exists "Members can update comments" on comments;
drop policy if exists "Members can delete comments" on comments;

-- Product context
drop policy if exists "Users can read own product_context" on product_context;
drop policy if exists "Users can insert own product_context" on product_context;
drop policy if exists "Users can update own product_context" on product_context;
drop policy if exists "Members can read product_context" on product_context;
drop policy if exists "Members can insert product_context" on product_context;
drop policy if exists "Members can update product_context" on product_context;

-- Profiles
drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Users can read profiles" on profiles;

-- Project members
drop policy if exists "Members can read project_members" on project_members;
drop policy if exists "Admins can insert project_members" on project_members;
drop policy if exists "Admins can update project_members" on project_members;
drop policy if exists "Admins can delete project_members" on project_members;

-- Project invites
drop policy if exists "Members can read project_invites" on project_invites;
drop policy if exists "Anyone can read invites by code" on project_invites;
drop policy if exists "Admins can insert project_invites" on project_invites;
drop policy if exists "Admins can update project_invites" on project_invites;
drop policy if exists "Admins can delete project_invites" on project_invites;

-- Task comments
drop policy if exists "Members can read task_comments" on task_comments;
drop policy if exists "Members can insert task_comments" on task_comments;
drop policy if exists "Users can update own task_comments" on task_comments;
drop policy if exists "Users can delete own task_comments" on task_comments;

-- Comment reactions
drop policy if exists "Members can read comment_reactions" on comment_reactions;
drop policy if exists "Members can insert comment_reactions" on comment_reactions;
drop policy if exists "Users can delete own comment_reactions" on comment_reactions;

-- =============================================================
-- CREATE ALL POLICIES (membership-based)
-- =============================================================

-- Profiles: any authenticated user can read profiles
create policy "Users can read profiles"
  on profiles for select
  using (auth.uid() is not null);

-- Projects: read/update if member, insert if owner
create policy "Members can read projects"
  on projects for select
  using (id in (select user_project_ids()));

create policy "Users can insert own projects"
  on projects for insert
  with check (auth.uid() = owner_id);

create policy "Members can update projects"
  on projects for update
  using (id in (select user_project_ids()));

-- Sections
create policy "Members can read sections"
  on sections for select
  using (project_id in (select user_project_ids()));

create policy "Members can insert sections"
  on sections for insert
  with check (project_id in (select user_project_ids()));

create policy "Members can update sections"
  on sections for update
  using (project_id in (select user_project_ids()));

create policy "Members can delete sections"
  on sections for delete
  using (project_id in (select user_project_ids()));

-- Tasks
create policy "Members can read tasks"
  on tasks for select
  using (project_id in (select user_project_ids()));

create policy "Members can insert tasks"
  on tasks for insert
  with check (project_id in (select user_project_ids()));

create policy "Members can update tasks"
  on tasks for update
  using (project_id in (select user_project_ids()));

create policy "Members can delete tasks"
  on tasks for delete
  using (project_id in (select user_project_ids()));

-- Notes
create policy "Members can read notes"
  on notes for select
  using (project_id in (select user_project_ids()));

create policy "Members can insert notes"
  on notes for insert
  with check (project_id in (select user_project_ids()));

create policy "Members can update notes"
  on notes for update
  using (project_id in (select user_project_ids()));

-- Comments (section comments)
create policy "Members can read comments"
  on comments for select
  using (project_id in (select user_project_ids()));

create policy "Members can insert comments"
  on comments for insert
  with check (project_id in (select user_project_ids()));

create policy "Members can update comments"
  on comments for update
  using (project_id in (select user_project_ids()));

create policy "Members can delete comments"
  on comments for delete
  using (project_id in (select user_project_ids()));

-- Product context
create policy "Members can read product_context"
  on product_context for select
  using (project_id in (select user_project_ids()));

create policy "Members can insert product_context"
  on product_context for insert
  with check (project_id in (select user_project_ids()));

create policy "Members can update product_context"
  on product_context for update
  using (project_id in (select user_project_ids()));

-- Project members
create policy "Members can read project_members"
  on project_members for select
  using (project_id in (select user_project_ids()));

create policy "Admins can insert project_members"
  on project_members for insert
  with check (project_id in (select user_project_ids()));

create policy "Admins can update project_members"
  on project_members for update
  using (project_id in (select user_project_ids()));

create policy "Admins can delete project_members"
  on project_members for delete
  using (project_id in (select user_project_ids()));

-- Project invites
create policy "Members can read project_invites"
  on project_invites for select
  using (project_id in (select user_project_ids()));

create policy "Anyone can read invites by code"
  on project_invites for select
  using (auth.uid() is not null);

create policy "Admins can insert project_invites"
  on project_invites for insert
  with check (project_id in (select user_project_ids()));

create policy "Admins can update project_invites"
  on project_invites for update
  using (project_id in (select user_project_ids()));

create policy "Admins can delete project_invites"
  on project_invites for delete
  using (project_id in (select user_project_ids()));

-- Task comments
create policy "Members can read task_comments"
  on task_comments for select
  using (project_id in (select user_project_ids()));

create policy "Members can insert task_comments"
  on task_comments for insert
  with check (project_id in (select user_project_ids()));

create policy "Users can update own task_comments"
  on task_comments for update
  using (user_id = auth.uid());

create policy "Users can delete own task_comments"
  on task_comments for delete
  using (user_id = auth.uid());

-- Comment reactions
create policy "Members can read comment_reactions"
  on comment_reactions for select
  using (
    comment_id in (
      select id from task_comments where project_id in (select user_project_ids())
    )
  );

create policy "Members can insert comment_reactions"
  on comment_reactions for insert
  with check (
    comment_id in (
      select id from task_comments where project_id in (select user_project_ids())
    )
  );

create policy "Users can delete own comment_reactions"
  on comment_reactions for delete
  using (user_id = auth.uid());

-- =============================================================
-- SEED: Insert existing project owners as members
-- =============================================================
insert into project_members (project_id, user_id, role)
select id, owner_id, 'owner' from projects
on conflict (project_id, user_id) do nothing;

-- =============================================================
-- TRIGGER: Auto-add owner as member on new project creation
-- =============================================================
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
