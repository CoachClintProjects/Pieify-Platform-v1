# Superuser Build Ledger — PIEify Platform v1

**Repository:** `CoachClintProjects/Pieify-Platform-v1`  
**Database:** Supabase `Pieify V1` (ref `woicxxlvwjxrydtfwcik`) — live, authoritative, multi-tenant  
**Principle:** Every feature is either **100% complete** (tested, persisted, auditable) or **incomplete**. No partial claims.

---

## 0. Foundation & Repository Bootstrap

**Status:** In progress

**Work items:**

- [x] Initialize repository with production-grade scaffold:
  - [x] TypeScript strict mode, ESLint, Prettier, test runner.
  - [x] Monorepo layout: `apps/web`, `apps/api` (if needed), `packages/*`.
  - [x] Supabase client configuration (publishable key only; secrets in environment).
  - [x] Environment template (`.env.example`) with required variables documented.
  - [x] CI workflow (typecheck, lint, test, build).
- [x] Create initial commit with scaffold.
- [ ] Link repository to Vercel project for preview deployments.
- [x] Create `BUILD_LEDGER.md` in repo root to mirror this ledger.

**Gaps:** Vercel linkage pending.

---

## 1. Authentication & Tenant Access

**Status:** Not started

**Work items:**

- [ ] Supabase Auth integration (email/password, magic link optional).
- [ ] Session guard: unauthenticated users cannot access app routes.
- [ ] Tenant resolution: load `account_id` from membership; enforce RLS.
- [ ] Role resolution: map `superuser`, `client_admin`, `client_user` to UI/authorization gates.
- [ ] Superuser cross-tenant access path (support mode) with audit logging.
- [ ] Auth error states (expired session, revoked access, missing membership) with clear messages.

**Gaps:** Everything.

---

## 2. Corporate Website (Database-Driven)

**Status:** Not started

**Work items:**

- [ ] Public routes: `/`, `/fire`, `/industries`, `/login`, `/register`, `/demo`.
- [ ] Content driven from `corporate_site_content` table.
- [ ] Hero, value proposition, workflow, pricing, ROI calculator.
- [ ] Demo request form → `demo_requests` + `demo_request_files` + notification.
- [ ] Login/register entry points to authenticated app.
- [ ] No placeholder text; all copy sourced from database or committed content.

**Gaps:** Everything.

---

## 3. Application Shell & Navigation

**Status:** Not started

**Work items:**

- [ ] Authenticated app shell with left navigation (HubSpot-style).
- [ ] Top bar with account context, notifications, user menu.
- [ ] Role-based navigation:
  - Superuser: Platform Admin, Accounts, AI & Cost, Audit, Support.
  - Client admin: Dashboard, CRM, Inventory, Analysis, Quotes, Reporting, Settings.
  - Client user: Dashboard, Inventory, Analysis, Quotes (no admin/settings).
- [ ] Global search stub (will wire to tenders/inventory/contacts later).
- [ ] Notification center stub (wired to `notifications` table).

**Gaps:** Everything.

---

## 4. Core Tender-to-Decision Workflow

**Status:** Not started

**Work items:**

- [ ] Bid session creation (`bid_sessions`, `tender_documents`, `tender_document_sources`).
- [ ] Document upload to Supabase Storage; metadata persisted.
- [ ] Text extraction pipeline (PDF/DOCX/XLSX → text) before AI call.
- [ ] AI extraction → `tender_parse_*`, `requirements`, `bid_specs`, `correction_events`.
- [ ] Human review UI: confidence badges, source snippets, correction form.
- [ ] Scoring engine invocation → `score_runs`, `match_results`, `score_results`.
- [ ] Results display: score breakdown, gaps, advantages, exceptions, questions.
- [ ] Questions generation → `clarification_questions`, mailto draft.
- [ ] Internal notes → `internal_notes`.
- [ ] Session feedback → `session_feedback`.

**Gaps:** Everything.

---

## 5. Inventory & Catalog (Dependable Data)

**Status:** Not started

**Work items:**

- [ ] Inventory list/detail views (`inventory_items`, `products`, `apparatus_options`).
- [ ] Import pipeline for Dependable catalog (CSV/Excel/PDF) → audited import.
- [ ] Duplicate detection, validation, and error reporting.
- [ ] Options/compatibility by apparatus type.
- [ ] Cost history tracking (`fob_cost_history`).
- [ ] Allocation awareness (open quotes, reserved units).

**Gaps:** Everything.

---

## 6. Pricing Waterfall & Quotes

**Status:** Not started

**Work items:**

- [ ] Quote creation linked to bid session and inventory unit.
- [ ] Full CRA-compliant waterfall:
  - FOB, freight, PDI, base landed, warranty reserve (internal), contingency, overhead, line items, trade-in, discount, target margin, tax rules, selling price, gross profit, commission (internal), net profit.
- [ ] Tax-exempt handling with certificate field.
- [ ] Offer letter artifact generation (PDF) → stored in `documents`.
- [ ] Quote versioning and audit trail.

**Gaps:** Everything.

---

## 7. CRM & Activity

**Status:** Not started

**Work items:**

- [ ] Contacts and accounts (customers/suppliers) CRUD.
- [ ] Communication activities (emails, calls, meetings) logged.
- [ ] Timeline view per account/contact/tender.
- [ ] Tasks and follow-ups (optional in V1 if not in scope).

**Gaps:** Everything.

---

## 8. Reporting & Win/Loss

**Status:** Not started

**Work items:**

- [ ] Win/loss debrief modal on status change (`win_loss_debriefs`).
- [ ] Reporting views: win rate, score distributions, activity over time.
- [ ] Exportable reports (CSV/PDF).

**Gaps:** Everything.

---

## 9. Platform Administration (Superuser)

**Status:** Not started

**Work items:**

- [ ] Tenant directory: list accounts, plans, status, created date.
- [ ] User and seat management per account.
- [ ] Subscription status and plan overrides.
- [ ] AI usage dashboard: runs, tokens, cost by model/account/date.
- [ ] Platform cost ledger visibility and margin analysis.
- [ ] Audit event explorer (filter by account, user, entity, action).
- [ ] Security event viewer (license integrity, tenant provisioning).
- [ ] Demo pipeline: requests, bookings, outcomes.
- [ ] Support access: enter a client account with reason, logged in `platform_access_sessions` and audit.

**Gaps:** Everything.

---

## 10. Acceptance Test Suite (Live Data)

**Status:** Not started

**Work items:**

- [ ] Import Dependable catalog as live inventory.
- [ ] Ingest 20 expired real tenders as `bid_sessions` with documents.
- [ ] Run end-to-end flow on each:
  - Extract → Review → Score → Results → Questions → Price → Offer → Outcome.
- [ ] Validate expected outcomes (e.g., RE9232 vs DEV-000223 → BID WITH QUESTIONS, tank/engine/wheelbase/NFPA flags, weights-and-balances warning).
- [ ] Record any gaps as issues and fix before marking complete.

**Gaps:** Everything.

---

## Current Active Work

- **Foundation & Repository Bootstrap** — initializing production scaffold and first commit.

---

## Outstanding Gaps (Summary)

At this moment, **all functional modules are incomplete**. The only work underway is the initial repository scaffold. Nothing is claimed as done until it is:

- Implemented end-to-end.
- Persisted to the live database.
- Exercised with real data.
- Auditable and role-safe.

---

*This ledger is the authoritative source of truth for the Superuser role.*
