-- AI agents and UAT harness

-- AI agents registry
create table if not exists ai_agents (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  enabled boolean default true,
  created_at timestamptz not null default now()
);
insert into ai_agents (name, description) values
  ('tender_extraction', 'Extracts sections, requirements, candidates, conflicts, gaps from tender PDFs'),
  ('tender_scoring', 'Scores bid against rule sets, flags critical fails and exceptions'),
  ('clarification_draft', 'Drafts clarification questions from gaps and conflicts')
on conflict (name) do nothing;

-- AI runs extended with bid linkage and value signals
alter table ai_runs add column if not exists bid_session_id uuid references bid_sessions(id) on delete cascade;
alter table ai_runs add column if not exists time_saved_minutes int default 0;
alter table ai_runs add column if not exists errors_prevented int default 0;
alter table ai_runs add column if not exists pricing_advantage_usd numeric default 0;
create index if not exists idx_ai_runs_bid on ai_runs(bid_session_id);

-- UAT test cases
create table if not exists uat_test_cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tender_name text,
  expected_time_saved_minutes int,
  expected_errors_prevented int,
  expected_margin_uplift_pct numeric,
  status text not null default 'open',
  executed_at timestamptz,
  result_summary text,
  created_at timestamptz not null default now()
);

-- Prototype progress tracking
create table if not exists prototype_progress (
  id uuid primary key default gen_random_uuid(),
  milestone text not null,
  target_date date,
  actual_date date,
  status text not null default 'in_progress',
  notes text,
  created_at timestamptz not null default now()
);
insert into prototype_progress (milestone, target_date, status, notes) values
  ('Extraction agent working on real tender', current_date + interval '7 days', 'in_progress', 'PDF → sections/requirements/candidates'),
  ('Scoring agent with critical fail logic', current_date + interval '10 days', 'in_progress', 'Mandatory vs desirable scoring'),
  ('Clarification draft agent', current_date + interval '12 days', 'in_progress', 'From gaps/conflicts to questions'),
  ('Value signals in tender UI', current_date + interval '14 days', 'in_progress', 'Time saved, errors prevented, pricing advantage'),
  ('Superuser real-time KPIs', current_date + interval '14 days', 'in_progress', 'Adoption, value, prototype progress'),
  ('UAT with live tenders', current_date + interval '21 days', 'in_progress', '5-7 test cases executed')
on conflict do nothing;

-- Superuser real-time KPIs view
create or replace view superuser_kpis as
select
  (select count(*) from accounts where status='active') as active_accounts,
  (select count(*) from bid_sessions where created_at > now() - interval '30 days') as bids_last_30d,
  (select count(*) from ai_runs where created_at > now() - interval '30 days') as ai_runs_last_30d,
  (select coalesce(sum(time_saved_minutes),0) from ai_runs where created_at > now() - interval '30 days') as time_saved_minutes_last_30d,
  (select coalesce(sum(errors_prevented),0) from ai_runs where created_at > now() - interval '30 days') as errors_prevented_last_30d,
  (select coalesce(sum(pricing_advantage_usd),0) from ai_runs where created_at > now() - interval '30 days') as pricing_advantage_last_30d,
  (select count(*) from uat_test_cases where status='open') as uat_open_cases,
  (select count(*) from uat_test_cases where status='passed') as uat_passed_cases,
  (select count(*) from prototype_progress where status='completed') as milestones_completed,
  (select count(*) from prototype_progress where status='in_progress') as milestones_in_progress;
