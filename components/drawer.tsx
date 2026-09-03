"use client";
import { useState, type ReactNode } from "react";

export function Drawer({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <>
    <button className="button button-secondary" onClick={() => setOpen(true)}>Open {title}</button>
    {open && <div style={{ position: "fixed", inset: 0, background: "rgba(16,42,67,0.5)", display: "grid", gridTemplateColumns: "minmax(320px, 420px) 1fr" }} onClick={() => setOpen(false)}>
      <aside style={{ background: "white", padding: 18, overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><strong>{title}</strong><button className="button button-secondary" onClick={() => setOpen(false)}>Close</button></div>
        {children}
      </aside>
    </div>}
  </>;
}
