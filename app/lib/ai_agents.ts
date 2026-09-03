// Minimal AI agents for tender workflow (extraction, scoring, clarifications)
// In production, these would call your actual AI services; here we simulate with deterministic logic + cost logging.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function runExtractionAgent(bidSessionId: string, documentIds: string[]) {
  // Simulate extraction: sections, requirements, candidates, conflicts, gaps
  const started = Date.now();
  // In real impl: call AI service to parse PDFs
  const sections = [
    { title: 'Instructions to Bidders', section_type: 'instructions', page_start: 1, page_end: 3, confidence: 0.92 },
    { title: 'Technical Specifications', section_type: 'specifications', page_start: 4, page_end: 10, confidence: 0.88 },
    { title: 'Evaluation Criteria', section_type: 'evaluation', page_start: 11, page_end: 12, confidence: 0.95 },
  ];
  const candidates = [
    { artifact_type: 'mandatory_requirement', title: 'NFPA compliance', extracted_value: 'NFPA 1901', confidence: 0.94, status: 'pending' },
    { artifact_type: 'desirable_requirement', title: 'Foam system', extracted_value: 'Class A foam', confidence: 0.87, status: 'pending' },
  ];
  const conflicts = [
    { conflict_type: 'contradictory_specs', description: 'Pump GPM specified as 1500 in one section, 1250 in another', status: 'open' },
  ];
  const gaps = [
    { gap_type: 'missing_info', title: 'Delivery timeline', description: 'No explicit delivery deadline stated', impact: 'medium' },
  ];

  // Insert into DB
  for (const s of sections) {
    await supabase.from('tender_parse_sections').insert({ bid_session_id: bidSessionId, ...s });
  }
  for (const c of candidates) {
    await supabase.from('tender_parse_candidates').insert({ bid_session_id: bidSessionId, ...c });
  }
  for (const c of conflicts) {
    await supabase.from('tender_parse_conflicts').insert({ bid_session_id: bidSessionId, ...c });
  }
  for (const g of gaps) {
    await supabase.from('tender_parse_gaps').insert({ bid_session_id: bidSessionId, ...g });
  }

  const durationMs = Date.now() - started;
  const timeSaved = 45; // minutes saved vs manual
  const errorsPrevented = 2; // e.g. missed mandatory, wrong section
  const costUsd = 0.12; // simulated AI cost

  const { data: run } = await supabase.from('ai_runs').insert({
    agent_name: 'tender_extraction',
    bid_session_id: bidSessionId,
    input_summary: `Extracted ${sections.length} sections, ${candidates.length} candidates, ${conflicts.length} conflicts, ${gaps.length} gaps`,
    output_summary: 'Extraction complete',
    duration_ms: durationMs,
    cost_usd: costUsd,
    time_saved_minutes: timeSaved,
    errors_prevented: errorsPrevented,
    pricing_advantage_usd: 0,
  }).select().single();

  await supabase.from('ai_run_usage').insert({ ai_run_id: run!.id, cost_usd: costUsd });

  return { sections, candidates, conflicts, gaps, run };
}

export async function runScoringAgent(bidSessionId: string) {
  // Simulate scoring: apply rule set, compute score, flag critical fails
  const started = Date.now();
  const score = 78;
  const recommendation = 'pursue';
  const criticalFail = false;
  const exceptions = [
    { exception_type: 'missing_certification', severity: 'warning', message: 'ULB certification not provided', status: 'open' },
  ];

  const { data: run } = await supabase.from('ai_runs').insert({
    agent_name: 'tender_scoring',
    bid_session_id: bidSessionId,
    input_summary: 'Scored bid against rule set',
    output_summary: `Score: ${score}, Recommendation: ${recommendation}`,
    duration_ms: Date.now() - started,
    cost_usd: 0.08,
    time_saved_minutes: 20,
    errors_prevented: 1,
    pricing_advantage_usd: 0,
  }).select().single();

  await supabase.from('ai_run_usage').insert({ ai_run_id: run!.id, cost_usd: 0.08 });

  await supabase.from('score_runs').insert({
    bid_session_id: bidSessionId,
    run_number: 1,
    engine_version: 'v1.0',
    percentage: score,
    final_score: score,
    recommendation,
    critical_fail: criticalFail,
  });

  for (const e of exceptions) {
    await supabase.from('scoring_exceptions').insert({ bid_session_id: bidSessionId, ...e });
  }

  return { score, recommendation, criticalFail, exceptions, run };
}

export async function runClarificationDraftAgent(bidSessionId: string) {
  // Simulate drafting clarifications from gaps/conflicts
  const started = Date.now();
  const questions = [
    { question: 'Please confirm the required pump GPM (1500 or 1250)?', status: 'draft' },
    { question: 'What is the expected delivery timeline for the apparatus?', status: 'draft' },
  ];

  const { data: run } = await supabase.from('ai_runs').insert({
    agent_name: 'clarification_draft',
    bid_session_id: bidSessionId,
    input_summary: 'Drafted clarifications from gaps/conflicts',
    output_summary: `${questions.length} questions drafted`,
    duration_ms: Date.now() - started,
    cost_usd: 0.05,
    time_saved_minutes: 15,
    errors_prevented: 1,
    pricing_advantage_usd: 0,
  }).select().single();

  await supabase.from('ai_run_usage').insert({ ai_run_id: run!.id, cost_usd: 0.05 });

  for (const q of questions) {
    await supabase.from('clarification_questions').insert({ bid_session_id: bidSessionId, ...q });
  }

  return { questions, run };
}
