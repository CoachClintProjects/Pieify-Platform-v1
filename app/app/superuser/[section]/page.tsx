import Link from 'next/link';
import { getServiceClient } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

type Config = { title: string; subtitle: string; table: string; columns: string[] };

const configs: Record<string, Config> = {
  organizations: { title: 'Organizations', subtitle: 'Every customer account in PIEify.', table: 'accounts', columns: ['name','status','created_at'] },
  users: { title: 'Users', subtitle: 'People attached to PIEify customer accounts.', table: 'profiles', columns: ['email','role','account_id','created_at'] },
  subscriptions: { title: 'Subscriptions & seats', subtitle: 'Plans, subscription state and seat allocation.', table: 'subscriptions', columns: ['plan','status','monthly_value','created_at'] },
  'demo-requests': { title: 'Demo requests', subtitle: 'Inbound requests from the PIEify site.', table: 'demo_requests', columns: ['first_name','last_name','company','email','status','created_at'] },
  tickets: { title: 'Support', subtitle: 'Customer issues currently recorded in PIEify.', table: 'support_tickets', columns: ['subject','status','priority','requester_name','created_at'] },
  tenders: { title: 'Tenders', subtitle: 'Tender records flowing through the platform.', table: 'bid_sessions', columns: ['name','status','created_at'] },
  requirements: { title: 'Requirements', subtitle: 'Structured tender requirements and evaluation inputs.', table: 'requirements', columns: ['name','status','created_at'] },
  inventory: { title: 'Inventory', subtitle: 'Apparatus and inventory records available to PIEify.', table: 'inventory_items', columns: ['name','status','created_at'] },
  catalogs: { title: 'Catalogs', subtitle: 'OEM and dealer catalog sources.', table: 'catalogs', columns: ['name','status','created_at'] },
  relationships: { title: 'OEMs & dealers', subtitle: 'Business relationships between organizations and suppliers.', table: 'business_relationships', columns: ['name','status','created_at'] },
  extraction: { title: 'Extraction', subtitle: 'Document extraction and workflow records.', table: 'document_workflows', columns: ['name','status','current_step','updated_at'] },
  matching: { title: 'Matching', subtitle: 'Product and inventory matching records.', table: 'match_results', columns: ['status','created_at'] },
  scoring: { title: 'Scoring', subtitle: 'Scoring models and score runs.', table: 'score_runs', columns: ['status','created_at'] },
  questions: { title: 'Questions', subtitle: 'Clarification questions generated or recorded for tenders.', table: 'clarification_questions', columns: ['question','status','created_at'] },
  ai: { title: 'AI runs', subtitle: 'Agent executions, models and run status.', table: 'ai_runs', columns: ['run_type','model','status','started_at','completed_at'] },
  automations: { title: 'Automations', subtitle: 'Automation and workflow activity.', table: 'document_workflows', columns: ['name','status','current_step','updated_at'] },
  workflows: { title: 'Workflows & jobs', subtitle: 'Background workflow records and current state.', table: 'document_workflows', columns: ['name','status','current_step','updated_at'] },
  integrations: { title: 'Integrations', subtitle: 'Integration synchronization runs.', table: 'integration_sync_runs', columns: ['direction','entity_type','status','records_read','records_written','records_failed','started_at'] },
  'data-quality': { title: 'Data quality', subtitle: 'Exceptions requiring attention.', table: 'exception_queue_items', columns: ['status','severity','created_at'] },
  revenue: { title: 'Revenue', subtitle: 'Subscription revenue records.', table: 'subscriptions', columns: ['plan','status','monthly_value','created_at'] },
  usage: { title: 'Usage & tokens', subtitle: 'Observed AI usage records and token consumption.', table: 'ai_run_usage', columns: ['provider','model','input_tokens','output_tokens','cached_input_tokens','actual_cost','created_at'] },
  costs: { title: 'AI costs', subtitle: 'Platform cost ledger records.', table: 'platform_cost_ledger', columns: ['amount','category','created_at'] },
  deployments: { title: 'Deployments', subtitle: 'Deployment state is tracked by the hosting platform.', table: 'deployment_events', columns: ['status','created_at'] },
  security: { title: 'Security', subtitle: 'Security-relevant platform events.', table: 'audit_events', columns: ['event_type','entity_type','action','occurred_at'] },
  audit: { title: 'Audit log', subtitle: 'Immutable record of platform activity exposed to PIEify.', table: 'audit_events', columns: ['event_type','entity_type','action','occurred_at'] },
  settings: { title: 'Platform settings', subtitle: 'Configuration records available to the platform.', table: 'platform_settings', columns: ['key','value','updated_at'] },
};

const labelize = (v: string) => v.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase());
const display = (v: unknown) => v === null || v === undefined || v === '' ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v);

export default async function SuperuserObjectIndex({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const config = configs[section];
  if (!config) return <div><h1 className="hs-page-title">Not configured</h1><p className="hs-page-sub">The requested platform object is not configured.</p></div>;

  const db = await getServiceClient();
  const { data, error, count } = await db.from(config.table).select('*', { count: 'exact' }).limit(50);
  const rows = (data || []) as Record<string, unknown>[];
  const keys = rows.length ? config.columns.filter(k => k in rows[0]) : config.columns;

  return <div>
    <div className="hs-breadcrumb"><Link href="/app/superuser">Platform Home</Link> / {config.title}</div>
    <div className="flex items-end justify-between gap-5">
      <div><h1 className="hs-page-title">{config.title}</h1><p className="hs-page-sub">{config.subtitle}</p></div>
      <div className="text-right text-xs text-gray-500"><b className="text-gray-800">{count ?? (error ? '—' : rows.length)}</b><br/>records</div>
    </div>
    <div className="hs-toolbar"><button className="hs-btn">Search</button><button className="hs-btn">Filter</button><button className="hs-btn">Sort</button><button className="hs-btn">Columns</button><div className="hs-grow"/><span className="text-xs text-gray-500">Live production data</span></div>
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {error ? <div className="px-5 py-8 text-sm text-gray-600"><b>Not configured:</b> {error.message}</div> : !rows.length ? <div className="px-5 py-10 text-sm text-gray-500">No records in production.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-gray-200 bg-gray-50"><tr>{keys.map(k => <th key={k} className="px-4 py-3 font-semibold text-gray-600">{labelize(k)}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{rows.map((row, i) => <tr key={String(row.id ?? i)} className="hover:bg-gray-50">{keys.map(k => <td key={k} className="px-4 py-3 text-gray-800">{display(row[k])}</td>)}</tr>)}</tbody></table></div>}
    </section>
  </div>;
}
