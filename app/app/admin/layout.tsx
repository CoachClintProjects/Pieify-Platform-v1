import { ReactNode } from 'react';
import AdminAccess from '../../../components/admin-access';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminAccess>{children}</AdminAccess>;
}
