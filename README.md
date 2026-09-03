# Pieify Corporate Site

Database-driven corporate site with a functional demo/sandbox flow.

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

- `/` corporate landing page (reads `corporate_site_content`)
- `/demo` demo/sandbox entry
- `/demo/request` demo request form
- `/demo/confirm` demo request confirmation
- `/api/demo` POST handler writing to `demo_requests`
- `/api/health` database health check

## Next steps

- Wire authentication to the existing Supabase project.
- Implement server-side authorization and role-aware UI.
- Extend the demo flow to auto-provision a demo account and seed data.
