import { getSupabaseServerClient } from '@/lib/auth';
import ClientHome from './components/ClientHome';

export const dynamic = 'force-dynamic';

export default async function AppHomePage() {
  const supabase = getSupabaseServerClient();
  return <ClientHome db={supabase} />;
}
