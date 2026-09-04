'use client';
import Link from 'next/link';

export default function Sidebar() {
  return <aside className="space-y-2"><Link href="/app" className="block text-gray-700">Dashboard</Link><Link href="/app/tenders" className="block text-gray-700">Tenders</Link><Link href="/app/superuser/health" className="block text-gray-700">Superuser</Link></aside>;
}
