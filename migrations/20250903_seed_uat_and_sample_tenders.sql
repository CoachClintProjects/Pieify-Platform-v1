-- Seed UAT test cases and sample tenders for fire apparatus

insert into uat_test_cases (title, description, tender_name, expected_time_saved_minutes, expected_errors_prevented, expected_margin_uplift_pct, status) values
  ('Extraction accuracy on complex tender', 'Verify sections, requirements, candidates, conflicts, gaps are correctly extracted', 'City of Example Fire Apparatus 2026', 45, 2, 0, 'open'),
  ('Scoring mandatory compliance', 'Ensure mandatory requirements are flagged and critical fail logic works', 'Metro Fire Truck RFP 2026', 20, 1, 0, 'open'),
  ('Clarification draft quality', 'Check AI-drafted questions address gaps and conflicts', 'Regional Apparatus Bid 2026', 15, 1, 0, 'open'),
  ('Pricing margin impact', 'Validate margin calculations and scenario modeling', 'County Fire Engine Purchase 2026', 10, 0, 3, 'open'),
  ('End-to-end workflow', 'Run full tender through extraction → scoring → clarifications → pricing → decision', 'Statewide Fire Apparatus Framework 2026', 90, 4, 5, 'open');

-- Sample bid session for UAT (if none exists)
insert into bid_sessions (name, issuer, status, created_by)
select 'City of Example Fire Apparatus 2026', 'City of Example', 'draft', id
from auth.users where role = 'superuser' limit 1
on conflict do nothing;
