import { getServiceClient } from '../lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = getServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  const isSuperuser = profile?.role === 'superuser';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/app" className="text-lg font-semibold text-blue-700">Pieify</Link>
            <nav className="hidden md:flex gap-4 text-sm">
              <Link href="/app/tenders/new" className="text-gray-700 hover:text-blue-700">New tender</Link>
              <Link href="/app/tenders" className="text-gray-700 hover:text-blue-700">Tenders</Link>
              {isSuperuser && (
                <div className="flex gap-4">
                  <Link href="/app/superuser/health" className="text-gray-700 hover:text-blue-700">Superuser</Link>
                  <Link href="/app/superuser/support" className="text-gray-700 hover:text-blue-700">Support</Link>
                  <Link href="/app/superuser/feedback" className="text-gray-700 hover:text-blue-700">Feedback</Link>
                  <Link href="/app/superuser/customizations" className="text-gray-700 hover:text-blue-700">Customizations</Link>
                </div>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">{user.email}</span>
            <form action="/auth/signout" method="post"><button type="submit" className="text-gray-700 hover:text-blue-700">Sign out</button></form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
