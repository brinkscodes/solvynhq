-- ============================================================
-- My Tasks: personal task manager tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Custom sections (user-created categories)
create table if not exists user_task_sections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Personal tasks
create table if not exists user_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section_id uuid references user_task_sections(id) on delete set null,
  name text not null,
  notes text not null default '',
  status text not null default 'todo' check (status in ('todo', 'in-progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  tags text[] not null default '{}',
  deadline timestamptz,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Indexes for performance
create index if not exists idx_user_task_sections_user on user_task_sections(user_id);
create index if not exists idx_user_tasks_user on user_tasks(user_id);
create index if not exists idx_user_tasks_section on user_tasks(section_id);

-- 3. Enable RLS
alter table user_task_sections enable row level security;
alter table user_tasks enable row level security;

-- 4. RLS policies — users can only access their own data
create policy "Users can view own sections"
  on user_task_sections for select
  using (auth.uid() = user_id);

create policy "Users can insert own sections"
  on user_task_sections for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sections"
  on user_task_sections for update
  using (auth.uid() = user_id);

create policy "Users can delete own sections"
  on user_task_sections for delete
  using (auth.uid() = user_id);

create policy "Users can view own tasks"
  on user_tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on user_tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on user_tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on user_tasks for delete
  using (auth.uid() = user_id);
