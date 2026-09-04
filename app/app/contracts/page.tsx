'use client';
import { useEffect, useState } from 'react';

export default function ContractsPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    // TODO: load contracts from API
    setRows([]);
  }, []);

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-medium text-blue-700">Contracts</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Contracts</h1></div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">No contracts yet.</p>
      </div>
    </div>
  );
}
