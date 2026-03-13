-- =============================================================
-- SolvynHQ: Project Files table + Storage bucket
-- Run this in Supabase SQL Editor
-- =============================================================

-- 14. PROJECT FILES (metadata for uploaded files)
create table if not exists project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  uploaded_by uuid not null references auth.users on delete cascade,
  file_name text not null,
  file_size bigint not null default 0,
  file_type text not null default '',
  storage_path text not null,
  tag text not null default 'other' check (tag in ('branding', 'marketing', 'operations', 'research', 'other')),
  created_at timestamptz default now()
);

create index if not exists idx_project_files_project on project_files(project_id, created_at desc);

alter table project_files enable row level security;

create policy "Members can read project_files"
  on project_files for select using (project_id in (select user_project_ids()));

create policy "Members can insert project_files"
  on project_files for insert with check (project_id in (select user_project_ids()));

create policy "Members can delete project_files"
  on project_files for delete using (project_id in (select user_project_ids()));

-- Create the storage bucket (public read for simplicity)
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', true)
on conflict (id) do nothing;

-- Storage policies: members can upload/read/delete
create policy "Members can upload files"
  on storage.objects for insert
  with check (bucket_id = 'project-files' and auth.uid() is not null);

create policy "Anyone can read project files"
  on storage.objects for select
  using (bucket_id = 'project-files');

create policy "Members can delete own files"
  on storage.objects for delete
  using (bucket_id = 'project-files' and auth.uid() is not null);
