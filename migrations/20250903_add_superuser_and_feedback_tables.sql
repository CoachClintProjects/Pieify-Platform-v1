-- Superuser business health views and support/feedback/features/customizations

-- Support tickets
create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  subject text not null,
  description text not null,
  severity text not null default 'medium',
  status text not null default 'open',
  assignee_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  time_spent_minutes int default 0,
  sla_breach boolean default false
);
create index if not exists idx_support_tickets_account on support_tickets(account_id);
create index if not exists idx_support_tickets_status on support_tickets(status);

-- Feedback items
create table if not exists feedback_items (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  user_id uuid references auth.users(id),
  feedback text not null,
  category text,
  votes int default 0,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
create index if not exists idx_feedback_account on feedback_items(account_id);

-- Feature requests
create table if not exists feature_requests (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  user_id uuid references auth.users(id),
  title text not null,
  description text,
  priority text default 'medium',
  status text not null default 'open',
  created_at timestamptz not null default now()
);
create index if not exists idx_feature_requests_account on feature_requests(account_id);

-- Customizations (per-account feature flags / vertical toggles)
create table if not exists customizations (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade unique,
  verticals_enabled text[] default '{}',
  feature_flags jsonb default '{}',
  branding jsonb default '{}',
  pricing_rules jsonb default '{}',
  updated_at timestamptz not null default now()
);

-- Superuser business health view (simplified)
create or replace view superuser_business_health as
select
  (select count(*) from accounts) as total_accounts,
  (select count(*) from accounts where status = 'active') as active_accounts,
  (select sum(monthly_value) from subscriptions where status = 'active') as total_mrr,
  (select sum(monthly_value)*12 from subscriptions where status = 'active') as total_arr,
  (select sum(cost_usd) from ai_run_usage where created_at > now() - interval '30 days') as ai_cost_last_30d,
  (select sum(cost_usd) from platform_cost_ledger where cost_type in ('infra','storage','egress') and created_at > now() - interval '30 days') as infra_cost_last_30d,
  (select count(*) from bid_sessions where created_at > now() - interval '30 days') as bids_last_30d,
  (select count(*) from ai_runs where created_at > now() - interval '30 days') as ai_runs_last_30d;
