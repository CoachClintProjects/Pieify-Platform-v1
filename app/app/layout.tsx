import { ReactNode } from 'react';
import { getRoleContext } from '../../lib/auth';
import { redirect } from 'next/navigation';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const ctx = await getRoleContext();
  if (!ctx) {
    redirect('/');
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
