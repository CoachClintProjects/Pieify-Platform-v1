import { getServiceClient } from '../../../../lib/auth';
import { NextResponse } from 'next/server';
import { runClarificationDraftAgent } from '../../../../lib/ai_agents';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  await runClarificationDraftAgent(params.id);
  return NextResponse.redirect(new URL(`/app/tenders/${params.id}/clarifications`, req.url));
}
