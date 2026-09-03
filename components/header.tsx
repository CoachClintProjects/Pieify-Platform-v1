'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        const { data: membership } = await supabase
          .from('memberships')
          .select('roles(name), accounts(name)')
          .eq('user_id', user.id)
          .limit(1)
          .single();
        if (membership) {
          setRole((membership.roles as { name: string })?.name || null);
          setAccountName((membership.accounts as { name: string } | null)?.name || null);
        }
      }
    }
    loadSession();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <div className="flex items-center gap-4">
        <div className="text-xl font-semibold text-gray-900">Pieify</div>
        {accountName && (
          <div className="text-sm text-gray-500">{accountName}</div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          {userEmail ? (
            <>
              <span className="font-medium">{userEmail}</span>
              {role && <span className="ml-2 text-gray-400">({role})</span>}
            </>
          ) : (
            'Not signed in'
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-blue-600 hover:underline"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
