'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  roleRequired?: string[];
  section?: 'workspace' | 'administration';
}

const workspaceItems: NavItem[] = [
  { label: 'Dashboard', href: '/app', section: 'workspace' },
  { label: 'Tenders', href: '/app/tenders', section: 'workspace' },
  { label: 'Inventory', href: '/app/inventory', section: 'workspace' },
  { label: 'Quotes', href: '/app/quotes', section: 'workspace' },
  { label: 'Suppliers', href: '/app/suppliers', section: 'workspace' },
  { label: 'Customers', href: '/app/customers', section: 'workspace' },
  { label: 'Contracts', href: '/app/contracts', section: 'workspace' },
  { label: 'Reports', href: '/app/reports', section: 'workspace' },
];

const adminItems: NavItem[] = [
  { label: 'Platform Admin', href: '/app/admin', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'Tenants', href: '/app/admin/tenants', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'Users', href: '/app/admin/users', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'Subscriptions', href: '/app/admin/subscriptions', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'AI runs', href: '/app/admin/ai-runs', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'Token usage', href: '/app/admin/token-usage', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'Cost ledger', href: '/app/admin/cost-ledger', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'Audit', href: '/app/admin/audit', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'Security', href: '/app/admin/security', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'Integrations', href: '/app/admin/integrations', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
  { label: 'Identity', href: '/app/admin/identity', roleRequired: ['superuser', 'platform_admin'], section: 'administration' },
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
      <nav className="p-4 space-y-4">
        <div>
          <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Workspace</div>
          <div className="mt-2 space-y-1">
            {workspaceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded text-sm ${
                  pathname === item.href || (item.href !== '/app' && pathname?.startsWith(item.href))
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {visibleAdminItems.length > 0 && (
          <div>
            <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Administration</div>
            <div className="mt-2 space-y-1">
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
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
