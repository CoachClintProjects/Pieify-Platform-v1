import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function CompleteUATPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getServiceClient();
  const { data: testCase } = await supabase.from('uat_test_cases').select('id, title, tender_name').eq('id', id).single();
  if (!testCase) notFound();

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">UAT</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Complete UAT: {testCase.title}</h1><p className="mt-2 text-sm text-gray-600">Record results for this test case.</p></div>
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <form action={async (fd) => {
          'use server';
          const db = getServiceClient();
          const resultSummary = fd.get('result_summary') as string;
          const passed = fd.get('passed') === 'true';
          await db.from('uat_test_cases').update({ status: passed ? 'passed' : 'failed', executed_at: new Date().toISOString(), result_summary: resultSummary }).eq('id', id);
        }} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Result summary</label><textarea name="result_summary" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" rows={4} placeholder="What happened? Did we meet expectations?" required /></div>
          <div><label className="block text-sm font-medium text-gray-700">Pass/fail</label><select name="passed" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" required><option value="true">Pass</option><option value="false">Fail</option></select></div>
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">Save result</button>
        </form>
      </section>
    </div>
  );
}
