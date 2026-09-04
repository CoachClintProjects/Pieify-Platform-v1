import { getServiceClient } from '@/lib/auth';
import ClientHome from '../app/components/ClientHome';
import PreviewShell from './PreviewShell';

export const dynamic = 'force-dynamic';

export default async function ClientPreviewPage() {
  const db = await getServiceClient();
  return <PreviewShell role="user"><ClientHome db={db} /></PreviewShell>;
}
