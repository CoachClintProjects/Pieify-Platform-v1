'use client';
import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [spend, setSpend] = useState<any>(null);

  useEffect(() => {
    // TODO: load spend analytics from API
    setSpend(null);
  }, []);

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-medium text-blue-700">Reports</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Reports</h1></div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">No reports available yet.</p>
      </div>
    </div>
  );
}
