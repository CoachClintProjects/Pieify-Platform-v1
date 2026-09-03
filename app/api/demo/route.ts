import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  const body = await req.json();
  const { email, first_name, last_name, company, role_title, tender_description } = body;
  if (!email || !first_name || !last_name || !company) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  const { error } = await supabase.from("demo_requests").insert({ email, first_name, last_name, company, role_title, tender_description, status: "new" });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
