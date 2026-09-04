'use client';
import { useEffect, useState } from 'react';

export default function IdentityPage() {
  const [sso, setSso] = useState<any[]>([]);

  useEffect(() => {
    // TODO: load SSO/IdP config from API
    setSso([]);
  }, []);

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-medium text-blue-700">Admin</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Identity (SSO/IdP)</h1><p className="mt-2 text-sm text-gray-600">Configure Azure AD / Okta / other identity providers.</p></div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">No identity providers configured yet.</p>
      </div>
    </div>
  );
}
