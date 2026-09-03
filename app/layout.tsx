import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pieify | Procurement intelligence",
  description: "Evidence-led procurement and bid decisioning."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
