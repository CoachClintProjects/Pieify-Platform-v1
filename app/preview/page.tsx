import { getServiceClient } from '@/lib/auth';
import ClientHome from '../app/components/ClientHome';

export const dynamic = 'force-dynamic';

export default async function ClientPreviewPage() {
  const db = await getServiceClient();
  return <ClientHome db={db} />;
}
