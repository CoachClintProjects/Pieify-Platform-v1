-- UAT execution and real tenders

-- Mark first UAT case as in_progress when first extraction runs
update uat_test_cases
set status = 'in_progress'
where title = 'Extraction accuracy on complex tender'
and not exists (select 1 from tender_parse_sections limit 1);

-- Seed a few more realistic fire apparatus tenders for UAT
insert into bid_sessions (name, issuer, status, vertical_id, created_by)
select s.name, s.issuer, 'draft', null, u.id
from (values
  ('Metro Fire Truck RFP 2026', 'Metro Fire District', 'draft'),
  ('Regional Apparatus Bid 2026', 'Regional Fire Authority', 'draft'),
  ('County Fire Engine Purchase 2026', 'County Fire Department', 'draft'),
  ('Statewide Fire Apparatus Framework 2026', 'State Fire Marshal', 'draft')
) as s(name, issuer, status)
cross join (select id from auth.users where role='superuser' limit 1) u
on conflict do nothing;

-- Seed minimal requirements for one tender to show mandatory compliance
insert into requirements (bid_session_id, requirement_type, name, description, weight, is_mandatory)
select id, 'technical', 'NFPA compliance', 'Must meet NFPA 1901 standards', 0.9, true
from bid_sessions where name = 'Metro Fire Truck RFP 2026'
on conflict do nothing;

insert into requirements (bid_session_id, requirement_type, name, description, weight, is_mandatory)
select id, 'technical', 'Foam system', 'Class A foam system required', 0.4, true
from bid_sessions where name = 'Metro Fire Truck RFP 2026'
on conflict do nothing;
