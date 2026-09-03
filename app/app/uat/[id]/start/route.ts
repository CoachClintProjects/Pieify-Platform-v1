import { getServiceClient } from '../../../lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: testCase } = await supabase.from('uat_test_cases').select('id').eq('id', params.id).single();
  if (!testCase) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await supabase.from('uat_test_cases').update({ status: 'in_progress' }).eq('id', params.id);
  return NextResponse.redirect(new URL('/app/uat', req.url));
}
