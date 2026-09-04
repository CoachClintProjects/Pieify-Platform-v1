import { NextResponse } from 'next/server';
import { getServiceClient } from '../../../../../lib/auth';
import { runExtractionAgent } from '../../../../../lib/ai_agents';

type Context = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Context) {
  const { id } = await params;
  const supabase = getServiceClient();
  const { data: docs } = await supabase.from('tender_documents').select('documents(id)').eq('bid_session_id', id);
  const docIds = (docs || []).map((d: any) => (d.documents as any).id);
  if (!docIds.length) return NextResponse.json({ error: 'No documents' }, { status: 400 });

  await runExtractionAgent(id, docIds);
  return NextResponse.redirect(new URL(`/app/tenders/${id}/extract`, req.url));
}
