import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  const { error } = await supabase.from("verticals").select("id").limit(1);
  return NextResponse.json({ ok: !error, configured: true, database: error ? "unavailable" : "reachable" }, { status: error ? 503 : 200 });
}
