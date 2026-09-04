'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function SignInPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true);
    const { error } = await createSupabaseBrowserClient().auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setBusy(false); return; }
    window.location.assign('/app');
  }
  const page: React.CSSProperties={minHeight:'100vh',display:'grid',placeItems:'center',background:'linear-gradient(135deg,#071a33,#092d5a 58%,#064b72)',padding:24,fontFamily:'Arial,Helvetica,sans-serif'};
  const card: React.CSSProperties={width:'100%',maxWidth:460,background:'#fff',borderRadius:10,padding:'42px 42px 30px',boxShadow:'0 28px 80px rgba(0,0,0,.3)'};
  const input: React.CSSProperties={width:'100%',marginTop:8,border:'1px solid #ccd8e5',borderRadius:5,padding:'13px 14px',fontSize:15,outline:'none',boxSizing:'border-box'};
  return <main style={page}><div style={card}>
    <a href="/" style={{fontSize:27,fontWeight:800,letterSpacing:'-1.5px',color:'#08254a',textDecoration:'none'}}>PIE<span style={{color:'#0b63ce'}}>ify</span><span style={{color:'#00a6a6'}}>.</span></a>
    <div style={{fontSize:10,fontWeight:800,letterSpacing:2,color:'#00a6a6',marginTop:25}}>PROCUREMENT INTELLIGENCE ENGINE</div>
    <h1 style={{fontSize:32,letterSpacing:-1.2,color:'#071a33',margin:'10px 0 8px'}}>Sign in</h1>
    <p style={{color:'#61738a',lineHeight:1.6,margin:'0 0 27px'}}>Enter your PIEify account to access the live procurement workspace.</p>
    <form onSubmit={submit} style={{display:'grid',gap:18}}>
      <label style={{fontSize:13,fontWeight:700,color:'#10233b'}}>Email<input style={input} type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label style={{fontSize:13,fontWeight:700,color:'#10233b'}}>Password<input style={input} type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {error&&<div role="alert" style={{background:'#fff1f0',border:'1px solid #f1c4c0',color:'#a32920',padding:'11px 13px',borderRadius:5,fontSize:13}}>{error}</div>}
      <button disabled={busy} style={{border:0,borderRadius:5,padding:'14px 18px',background:'#0b63ce',color:'#fff',fontSize:15,fontWeight:800,cursor:busy?'wait':'pointer'}}>{busy?'Signing in…':'Sign in to PIEify'}</button>
    </form>
    <div style={{display:'flex',justifyContent:'space-between',marginTop:28,paddingTop:18,borderTop:'1px solid #e4ebf2',fontSize:12,color:'#708399'}}><a href="/" style={{color:'#0b63ce'}}>← PIEify home</a><span>Live account access</span></div>
  </div></main>;
}
