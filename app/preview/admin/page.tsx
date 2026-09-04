import AdminPage from '../../app/admin/page';
import PreviewShell from '../PreviewShell';
export const dynamic = 'force-dynamic';
export default async function AdminPreviewPage() {
  return <PreviewShell role="admin"><AdminPage /></PreviewShell>;
}
