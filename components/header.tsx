'use client';
import Link from 'next/link';

export default function Header() {
  return <header className="border-b border-gray-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><Link href="/app" className="text-lg font-semibold text-blue-700">Pieify</Link><nav className="flex gap-4 text-sm"><Link href="/app/tenders" className="text-gray-700">Tenders</Link><Link href="/app/uat" className="text-gray-700">UAT</Link></nav></div></header>;
}
