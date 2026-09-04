'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    window.location.assign('/app');
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <a href="/" className="auth-brand">PIE<span>ify</span></a>
        <p className="auth-kicker">PROCUREMENT INTELLIGENCE ENGINE</p>
        <h1>Sign in to PIEify</h1>
        <p className="auth-copy">Access your live procurement workspace and the data your organization is authorized to see.</p>
        <form onSubmit={submit} className="auth-form">
          <label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="auth-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <div className="auth-foot"><a href="/">← Back to PIEify</a><span>Live account access</span></div>
      </div>
    </main>
  );
}
