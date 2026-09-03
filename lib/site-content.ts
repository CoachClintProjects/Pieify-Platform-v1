import { supabase } from "./supabase";

export async function getCorporateContent(section?: string) {
  if (!supabase) return [];
  let q = supabase.from("corporate_site_content").select("key,value,section,sort_order,published").eq("published", true);
  if (section) q = q.eq("section", section);
  const { data, error } = await q.order("sort_order");
  if (error) return [];
  return data ?? [];
}
