"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DemoRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/demo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Request failed");
      router.push("/demo/confirm");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return <main className="container" style={{ padding: "80px 0", maxWidth: 620 }}><Link href="/demo">\u2190 Back to demo</Link><div className="card" style={{ marginTop: 24 }}><p className="muted">DEMO REQUEST</p><h1>Get a demo workspace</h1><p className="muted">Tell us about your team. We\'ll provision a demo workspace and email you access details.</p><form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, marginTop: 24 }}><label>First name<input name="first_name" required style={{ display: "block", width: "100%", padding: 12, marginTop: 6, border: "1px solid #d9e2ec", borderRadius: 8 }} /></label><label>Last name<input name="last_name" required style={{ display: "block", width: "100%", padding: 12, marginTop: 6, border: "1px solid #d9e2ec", borderRadius: 8 }} /></label><label>Company<input name="company" required style={{ display: "block", width: "100%", padding: 12, marginTop: 6, border: "1px solid #d9e2ec", borderRadius: 8 }} /></label><label>Email<input name="email" type="email" required style={{ display: "block", width: "100%", padding: 12, marginTop: 6, border: "1px solid #d9e2ec", borderRadius: 8 }} /></label><label>Role / title<input name="role_title" style={{ display: "block", width: "100%", padding: 12, marginTop: 6, border: "1px solid #d9e2ec", borderRadius: 8 }} /></label><label>What are you trying to procure?<textarea name="tender_description" rows={4} style={{ display: "block", width: "100%", padding: 12, marginTop: 6, border: "1px solid #d9e2ec", borderRadius: 8 }} /></label>{error && <p style={{ color: "#c62828" }}>{error}</p>}<button className="button button-primary" type="submit" disabled={loading}>{loading ? "Submitting\u2026" : "Request demo"}</button></form></div></main>;
}
