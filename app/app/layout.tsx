import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // TODO: replace with real role from session
  const role: string | null = "superuser";
  return <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "220px 1fr" }}>
    <Sidebar role={role} />
    <section>
      <Header role={role} />
      <main className="container" style={{ padding: "26px 0" }}>{children}</main>
    </section>
  </div>;
}
