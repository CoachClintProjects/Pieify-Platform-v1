'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  roleRequired?: string[];
}

const commonItems: NavItem[] = [
  { label: 'Dashboard', href: '/app' },
  { label: 'Tenders', href: '/app/tenders' },
  { label: 'Inventory', href: '/app/inventory' },
  { label: 'Quotes', href: '/app/quotes' },
];

const adminItems: NavItem[] = [
  { label: 'Platform Admin', href: '/app/admin', roleRequired: ['superuser', 'platform_admin'] },
];

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: membership } = await supabase
        .from('memberships')
        .select('roles(name)')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      setRole((membership?.roles as { name: string } | null)?.name || null);
    }
    loadRole();
  }, [supabase]);

  const visibleAdminItems = adminItems.filter(
    (item) => !item.roleRequired || (role && item.roleRequired.includes(role))
  );

  return (
    <aside className="w-64 border-r bg-gray-50 h-full overflow-y-auto">
      <nav className="p-4 space-y-1">
        {commonItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded text-sm ${
              pathname === item.href
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label}
          </Link>
        ))}
        {visibleAdminItems.length > 0 && (
          <>
            <div className="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">
              Administration
            </div>
            {visibleAdminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded text-sm ${
                  pathname?.startsWith(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
