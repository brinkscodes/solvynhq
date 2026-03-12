-- =============================================================
-- Form Submissions table for Elementor webhook integration
-- Run this in the Supabase SQL Editor
-- =============================================================

-- 13. FORM SUBMISSIONS (from Elementor webhooks)
create table if not exists form_submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  form_name text not null default 'Unknown Form',
  fields jsonb not null default '{}',
  meta jsonb default '{}',
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz default now()
);

create index if not exists idx_form_submissions_project on form_submissions(project_id, created_at desc);

alter table form_submissions enable row level security;

create policy "Members can read form_submissions"
  on form_submissions for select using (project_id in (select user_project_ids()));

create policy "Members can update form_submissions"
  on form_submissions for update using (project_id in (select user_project_ids()));

-- Insert is done via admin client (webhook endpoint), so no insert policy needed for regular users
