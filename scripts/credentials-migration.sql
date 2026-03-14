-- Credentials vault table
create table if not exists credentials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  service_name text not null,
  username text not null default '',
  password text not null default '',
  url text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS enabled but no policies needed — API uses admin client (service role)
alter table credentials enable row level security;

-- Index
create index if not exists idx_credentials_project_id on credentials(project_id);
