import { NextResponse } from 'next/server';
import { getServiceClient } from '../../../../../lib/auth';
import { runScoringAgent } from '../../../../../lib/ai_agents';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  await runScoringAgent(params.id);
  return NextResponse.redirect(new URL(`/app/tenders/${params.id}/score`, req.url));
}
