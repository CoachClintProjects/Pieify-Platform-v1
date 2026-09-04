-- Document upload and UAT thresholds

-- Ensure tender_documents link is solid
alter table tender_documents add column if not exists created_at timestamptz not null default now();

-- UAT success criteria thresholds
alter table uat_test_cases add column if not exists threshold_time_saved_minutes int default 0;
alter table uat_test_cases add column if not exists threshold_errors_prevented int default 0;
alter table uat_test_cases add column if not exists threshold_margin_uplift_pct numeric default 0;

update uat_test_cases set
  threshold_time_saved_minutes = coalesce(expected_time_saved_minutes, 30),
  threshold_errors_prevented = coalesce(expected_errors_prevented, 2),
  threshold_margin_uplift_pct = coalesce(expected_margin_uplift_pct, 3)
where threshold_time_saved_minutes = 0;

-- Role-based access control helper view
create or replace view user_context as
select
  u.id as user_id,
  u.email,
  p.role,
  p.account_id
from auth.users u
left join user_profiles p on p.id = u.id;
