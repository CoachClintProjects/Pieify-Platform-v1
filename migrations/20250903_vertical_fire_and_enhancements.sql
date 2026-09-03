-- Fire apparatus vertical hardening and enhancements

-- Fire-specific tender fields
create table if not exists fire_tender_specs (
  id uuid primary key default gen_random_uuid(),
  bid_session_id uuid references bid_sessions(id) on delete cascade unique,
  pump_gpm int,
  tank_capacity_gallons int,
  foam_system boolean default false,
  ulb_compliance boolean default false,
  nfpa_standard text,
  cold_weather_package boolean default false,
  created_at timestamptz not null default now()
);

-- Enhanced requirements with fire-specific flags
alter table requirements add column if not exists is_mandatory boolean default false;
alter table requirements add column if not exists fire_specific boolean default false;

-- Enhanced superuser KPIs view
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
  (select count(*) from prototype_progress where status='in_progress') as milestones_in_progress,
  (select count(*) from subscriptions where status='active') as active_subscriptions,
  (select count(*) from bid_sessions where status='won') as won_bids,
  (select count(*) from bid_sessions where status in ('draft','in_progress')) as pipeline_bids;

-- CSV import/export staging
create table if not exists erp_import_staging (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  source text not null,
  raw_json jsonb not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
