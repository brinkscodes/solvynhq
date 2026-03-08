-- =============================================================
-- Meeting Agenda Items Migration
-- Run this in Supabase SQL Editor
-- =============================================================

create table meeting_agenda_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  type text not null default 'note' check (type in ('note', 'question', 'action')),
  content text not null,
  completed boolean default false,
  created_at timestamptz default now()
);

create index idx_meeting_agenda_items_project on meeting_agenda_items(project_id);

alter table meeting_agenda_items enable row level security;

create policy "Members can read meeting_agenda_items"
  on meeting_agenda_items for select using (project_id in (select user_project_ids()));

create policy "Members can insert meeting_agenda_items"
  on meeting_agenda_items for insert with check (project_id in (select user_project_ids()));

create policy "Users can update own meeting_agenda_items"
  on meeting_agenda_items for update using (user_id = auth.uid());

create policy "Users can delete own meeting_agenda_items"
  on meeting_agenda_items for delete using (user_id = auth.uid());
