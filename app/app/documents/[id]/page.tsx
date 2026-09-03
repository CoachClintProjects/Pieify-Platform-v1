import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: doc } = await supabase.from('documents').select('*, profiles(display_name)').eq('id', params.id).single();
  if (!doc) notFound();

  const { data: versions } = await supabase.from('document_versions').select('version, checksum, uploaded_by, created_at').eq('document_id', params.id).order('version', { ascending: false });
  const { data: workflows } = await supabase.from('document_workflows').select('*, document_workflow_steps(step_number, name, status, approver_user_id)').eq('document_id', params.id);
  const { data: comments } = await supabase.from('document_comments').select('*, profiles(display_name)').eq('document_id', params.id).order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Document management</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">{doc.filename}</h1><p className="mt-2 text-sm text-gray-600">Live document detail with workflow, versions, and comments.</p></div>
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Type</p><p className="mt-2 text-xl font-semibold">{doc.document_type || '—'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Status</p><p className="mt-2 text-xl font-semibold">{doc.status}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Uploaded by</p><p className="mt-2 text-xl font-semibold">{(doc.profiles as any)?.display_name || '—'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Size</p><p className="mt-2 text-xl font-semibold">{doc.file_size ? `${Math.round(doc.file_size/1024)} KB` : '—'}</p></div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Workflow</h2></div>
        <div className="p-5 text-sm text-gray-600">
          {workflows?.length ? workflows.map(w => (
            <div key={w.id} className="mb-4">
              <p className="font-medium text-gray-900">{w.name} — <span className={w.status==='approved'?'text-green-600':w.status==='rejected'?'text-red-600':'text-gray-600'}>{w.status}</span></p>
              <div className="mt-2 space-y-1">
                {(w.document_workflow_steps as any[] || []).map(s => <div key={s.step_number} className="text-gray-600">Step {s.step_number}: {s.name} — <span className={s.status==='approved'?'text-green-600':s.status==='rejected'?'text-red-600':'text-gray-600'}>{s.status}</span></div>)}
              </div>
            </div>
          )) : <p>No workflows defined.</p>}
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Versions</h2></div>
        <div className="p-5 text-sm text-gray-600">
          {versions?.length ? versions.map(v => <div key={v.version} className="py-1">Version {v.version} — {v.checksum ? <code className="text-gray-500">{v.checksum.slice(0,12)}</code> : '—'} <span className="text-gray-400">{new Date(v.created_at).toLocaleString()}</span></div>) : <p>No versions.</p>}
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Comments</h2></div>
        <div className="p-5 text-sm text-gray-600">
          {comments?.length ? comments.map(c => <div key={c.id} className="py-2 border-b last:border-0"><p className="font-medium text-gray-900">{(c.profiles as any)?.display_name || 'Unknown'}</p><p className="text-gray-700">{c.body}</p><p className="text-xs text-gray-400 mt-1">{new Date(c.created_at).toLocaleString()} {c.resolved && <span className="text-green-600">(resolved)</span>}</p></div>) : <p>No comments.</p>}
        </div>
      </section>
    </div>
  );
}
