-- =============================================================
-- Social Proof Tables Migration
-- Partners, Advisory Board, Volunteers
-- =============================================================

-- Partners
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  name text not null,
  logo_url text default '',
  type text not null default 'retail' check (type in ('retail', 'distribution', 'co-brand', 'media', 'other')),
  description text default '',
  website text default '',
  status text not null default 'active' check (status in ('active', 'pending', 'past')),
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_partners_project on partners(project_id);
alter table partners enable row level security;

create policy "Members can read partners"
  on partners for select using (project_id in (select user_project_ids()));
create policy "Members can insert partners"
  on partners for insert with check (project_id in (select user_project_ids()));
create policy "Members can update partners"
  on partners for update using (project_id in (select user_project_ids()));
create policy "Members can delete partners"
  on partners for delete using (project_id in (select user_project_ids()));

-- Advisory Board
create table if not exists advisory_board (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  name text not null,
  title text default '',
  organization text default '',
  expertise_area text default '',
  bio text default '',
  linkedin_url text default '',
  headshot_url text default '',
  status text not null default 'active' check (status in ('active', 'emeritus')),
  date_joined date,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_advisory_board_project on advisory_board(project_id);
alter table advisory_board enable row level security;

create policy "Members can read advisory_board"
  on advisory_board for select using (project_id in (select user_project_ids()));
create policy "Members can insert advisory_board"
  on advisory_board for insert with check (project_id in (select user_project_ids()));
create policy "Members can update advisory_board"
  on advisory_board for update using (project_id in (select user_project_ids()));
create policy "Members can delete advisory_board"
  on advisory_board for delete using (project_id in (select user_project_ids()));

-- Volunteers
create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  name text not null,
  email text default '',
  phone text default '',
  role text not null default 'ambassador' check (role in ('ambassador', 'event-coordinator', 'content-creator', 'community-lead', 'field-rep')),
  status text not null default 'applied' check (status in ('applied', 'active', 'inactive', 'alumni')),
  bio text default '',
  photo_url text default '',
  instagram_url text default '',
  application_date date default current_date,
  start_date date,
  total_hours numeric(8,1) default 0,
  events_attended int default 0,
  notes text default '',
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_volunteers_project on volunteers(project_id);
alter table volunteers enable row level security;

create policy "Members can read volunteers"
  on volunteers for select using (project_id in (select user_project_ids()));
create policy "Members can insert volunteers"
  on volunteers for insert with check (project_id in (select user_project_ids()));
create policy "Members can update volunteers"
  on volunteers for update using (project_id in (select user_project_ids()));
create policy "Members can delete volunteers"
  on volunteers for delete using (project_id in (select user_project_ids()));
