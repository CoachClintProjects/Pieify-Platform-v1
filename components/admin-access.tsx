import { ReactNode } from 'react';
import { getRoleContext, isPlatformAdmin, isSuperuser } from '../lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminAccess({ children }: { children: ReactNode }) {
  const roleCtx = await getRoleContext();
  const isAdmin = await isPlatformAdmin();
  const isSuper = await isSuperuser();
  if (!isAdmin && !isSuper) redirect('/app');
  return <>{children}</>;
}
