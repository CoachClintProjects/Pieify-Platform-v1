import SuperuserHome from '../../app/superuser/page';
import PreviewShell from '../PreviewShell';
export const dynamic = 'force-dynamic';
export default async function SuperuserPreviewPage() {
  return <PreviewShell role="superuser"><SuperuserHome /></PreviewShell>;
}
