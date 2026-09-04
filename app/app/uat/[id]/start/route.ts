import { NextResponse } from 'next/server';
import { getServiceClient } from '../../../../lib/auth';

type Context = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Context) {
  const { id } = await params;
  const supabase = getServiceClient();
  const { data: testCase } = await supabase.from('uat_test_cases').select('id').eq('id', id).single();
  if (!testCase) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await supabase.from('uat_test_cases').update({ status: 'in_progress' }).eq('id', id);
  return NextResponse.redirect(new URL('/app/uat', req.url));
}
