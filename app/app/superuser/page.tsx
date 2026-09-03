import Link from 'next/link';

export default function SuperuserIndexPage() {
  const links = [
    { label: 'Business health', href: '/app/superuser/health' },
    { label: 'Support tickets', href: '/app/superuser/support' },
    { label: 'Feedback & features', href: '/app/superuser/feedback' },
    { label: 'Customizations', href: '/app/superuser/customizations' },
  ];
  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Superuser</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Superuser</h1><p className="mt-2 text-sm text-gray-600">Own the system: see everything, control everything.</p></div>
      <section className="grid gap-4 sm:grid-cols-2">
        {links.map(l => <Link key={l.href} href={l.href} class="rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-300"><p class="text-lg font-semibold text-blue-700">{l.label}</p></Link>)}
      </section>
    </div>
  );
}
