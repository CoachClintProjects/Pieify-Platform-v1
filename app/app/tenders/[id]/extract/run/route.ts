import { getServiceClient } from '../../../../lib/auth';
import { NextResponse } from 'next/server';
import { runExtractionAgent } from '../../../../lib/ai_agents';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: docs } = await supabase.from('tender_documents').select('documents(id)').eq('bid_session_id', params.id);
  const docIds = (docs || []).map(d => (d.documents as any).id);
  if (!docIds.length) return NextResponse.json({ error: 'No documents' }, { status: 400 });

  await runExtractionAgent(params.id, docIds);
  return NextResponse.redirect(new URL(`/app/tenders/${params.id}/extract`, req.url));
}
