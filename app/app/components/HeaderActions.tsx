'use client';

import Link from 'next/link';
import { useState } from 'react';

function Icon({ name }: { name: 'plus'|'grid'|'help'|'settings'|'bell'|'spark' }) {
  const paths: Record<string, React.ReactNode> = {
    plus: <><path d="M12 5v14M5 12h14"/></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    help: <><circle cx="12" cy="12" r="8.5"/><path d="M9.8 9.2a2.5 2.5 0 1 1 4.1 1.9c-1.1.9-1.9 1.3-1.9 2.9"/><path d="M12 17h.01"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.5 1.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.1v-.4a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.5-1.5.1-.1A1.7 1.7 0 0 0 9 15a1.7 1.7 0 0 0-1.5-1H7.1v-2.1h.4a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.5-1.5.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V6h2.1v.4a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.5 1.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0-1.5 1Z"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    spark: <><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z"/><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function HeaderActions({ email, isSuperuser }: { email: string; isSuperuser: boolean }) {
  const [open, setOpen] = useState(false);
  return <div className="hs-top-actions">
    <button className="hs-upgrade">{isSuperuser ? 'Platform' : 'Upgrade'}</button>
    <button className="hs-icon-btn" aria-label="Create"><Icon name="plus"/></button>
    <button className="hs-icon-btn" aria-label="Apps"><Icon name="grid"/></button>
    <button className="hs-icon-btn" aria-label="Help"><Icon name="help"/></button>
    <Link className="hs-icon-btn" aria-label="Settings" href={isSuperuser ? '/app/superuser/settings' : '/app/settings'}><Icon name="settings"/></Link>
    <button className="hs-icon-btn" aria-label="Notifications"><Icon name="bell"/></button>
    <button className="hs-icon-btn" aria-label="Assistant"><Icon name="spark"/></button>
    <div className="hs-role-menu-wrap">
      <button className="hs-account hs-account-button" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <div className="hs-avatar">{(email ?? 'U').slice(0,1).toUpperCase()}</div><span className="hs-account-name">{email}</span><span className="hs-account-chevron">▾</span>
      </button>
      {open && <div className="hs-role-menu">
        <div className="hs-role-menu-title">Demo role switcher</div>
        <Link href="/preview">User — Demo</Link>
        <Link href="/preview/admin">Client Admin — Demo</Link>
        <Link href="/preview/superuser">Superuser</Link>
        <div className="hs-role-divider" />
        <Link href="/auth/signout">Sign out</Link>
      </div>}
    </div>
  </div>;
}
