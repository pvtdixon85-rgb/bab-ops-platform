-- BAB Ops Platform starter schema

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  job_number text unique,
  client_name text,
  company_name text,
  email text,
  phone text,
  show_name text,
  location text,
  start_date date,
  end_date date,
  booth_size text,
  labor_needed text,
  message text,
  status text default 'New Lead',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  file_name text,
  file_url text,
  file_type text,
  uploaded_at timestamptz default now()
);

create table if not exists crew_members (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  role text,
  home_region text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists job_assignments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  crew_member_id uuid references crew_members(id) on delete cascade,
  assignment_role text,
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz default now()
);
