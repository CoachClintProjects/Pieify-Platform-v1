import { ReactNode } from 'react';
import { getRoleContext, isPlatformAdmin, isSuperuser } from '../lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminAccess({ children }: { children: ReactNode }) {
  const context = await getRoleContext();

  if (!context) redirect('/');
  if (!isSuperuser(context.role) && !isPlatformAdmin(context.role)) {
    redirect('/app');
  }

  return <>{children}</>;
}
