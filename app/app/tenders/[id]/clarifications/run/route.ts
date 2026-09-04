import { NextResponse } from 'next/server';
import { getServiceClient } from '../../../../../lib/auth';
import { runClarificationDraftAgent } from '../../../../../lib/ai_agents';

type Context = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Context) {
  const { id } = await params;
  await runClarificationDraftAgent(id);
  return NextResponse.redirect(new URL(`/app/tenders/${id}/clarifications`, req.url));
}
