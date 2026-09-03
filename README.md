# Pieify Platform V1

Complete rebuild: database-driven corporate site, HubSpot-style app shell, superuser control plane, and user workspace.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase project `woicxxlvwjxrydtfwcik`
- Vercel deployment target

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (preferred) or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Never add service-role keys or provider secrets to browser code or Git.

## Routes

### Corporate
- `/` corporate landing page (reads `corporate_site_content`)
- `/demo` demo/sandbox entry
- `/demo/request` demo request form
- `/demo/confirm` demo request confirmation
- `/api/demo` POST handler writing to `demo_requests`
- `/api/health` database health check

### App (HubSpot-style shell)
- `/app` workspace overview
- `/app/tenders` tender queue
- `/app/inventory` inventory records
- `/app/quotes` quote records
- `/app/admin` superuser overview
- `/app/admin/tenants` tenants/accounts
- `/app/admin/users` users/profiles
- `/app/admin/subscriptions` subscriptions/seats
- `/app/admin/ai-runs` AI runs
- `/app/admin/token-usage` token usage & cost
- `/app/admin/cost-ledger` platform cost ledger
- `/app/admin/audit` audit events
- `/app/admin/security` security & license events

## Next steps

- Wire real authentication and session-based role.
- Add server-side authorization guards for platform routes.
- Extend detail drawers for each entity (tender, inventory item, quote, account, user, run).
- Add filters, saved views, and inline actions to tables.
