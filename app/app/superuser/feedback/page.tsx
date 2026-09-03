import { getServiceClient } from '../../../lib/auth';

export default async function SuperuserFeedbackPage() {
  const supabase = getServiceClient();
  const { data: feedback } = await supabase.from('feedback_items').select('*, accounts(name)').order('votes', { ascending: false });
  const { data: features } = await supabase.from('feature_requests').select('*, accounts(name)').order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Superuser</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Feedback & features</h1><p className="mt-2 text-sm text-gray-600">What users are asking for and how we’re responding.</p></div>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Feedback</h2></div><div className="p-5 text-sm">{feedback?.length ? feedback.map(f=>(<div key={f.id} class="py-1"><span class="font-medium">{(f.accounts as any)?.name}</span> — {f.feedback} <span class="text-gray-400">votes: {f.votes}</span> — <span class={f.status==='shipped'?'text-green-600':'text-gray-600'}>{f.status}</span></div>)) : <p class="text-gray-500">No feedback yet.</p>}</div></div>
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Feature requests</h2></div><div className="p-5 text-sm">{features?.length ? features.map(f=>(<div key={f.id} class="py-1"><span class="font-medium">{(f.accounts as any)?.name}</span> — {f.title} <span class="text-gray-400">{f.description}</span> — <span class={f.status==='shipped'?'text-green-600':f.status==='planned'?'text-amber-600':'text-gray-600'}>{f.status}</span></div>)) : <p class="text-gray-500">No feature requests yet.</p>}</div></div>
      </section>
    </div>
  );
}
