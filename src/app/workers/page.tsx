'use client';

import React from 'react';
import { Search, Filter, CheckCircle, XCircle, UserX } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useWorkers, useApproveWorker, useRejectWorker, useSuspendWorker } from '@/hooks/admin-hooks';



export default function WorkersPage() {
  const { data: workers, isLoading } = useWorkers();
  const approve = useApproveWorker();
  const reject  = useRejectWorker();
  const suspend = useSuspendWorker();

  const columns = [
    { header: 'Worker ID', accessor: 'id' },
    { header: 'Name',      accessor: 'name',     render: (v: string) => <span className="font-semibold text-blue-dark">{v}</span> },
    { header: 'Skill',     accessor: 'skill' },
    { header: 'Location',  accessor: 'location' },
    { header: 'Rating',    accessor: 'rating',   render: (v: string) => <span className="font-bold text-blue">⭐ {v}</span> },
    { header: 'Jobs Done', accessor: 'jobs' },
    { header: 'KYC',       accessor: 'kyc',      render: (v: string) => <StatusBadge status={v} /> },
    { header: 'Status',    accessor: 'status',   render: (v: string) => <StatusBadge status={v} /> },
    { header: 'Actions',   accessor: 'id',       render: (_: any, row: any) => (
      <div className="flex items-center gap-2">
        {row.kyc === 'Pending' && (
          <>
            <button onClick={() => approve.mutate(row.id)} disabled={approve.isPending} className="p-2 text-green hover:bg-green-pale rounded-lg transition-colors" title="Approve KYC"><CheckCircle className="w-4 h-4" /></button>
            <button onClick={() => reject.mutate({ id: row.id })} disabled={reject.isPending} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reject KYC"><XCircle className="w-4 h-4" /></button>
          </>
        )}
        {row.status === 'Active' && (
          <button onClick={() => suspend.mutate({ id: row.id })} disabled={suspend.isPending} className="p-2 text-orange hover:bg-orange-bg rounded-lg transition-colors" title="Suspend"><UserX className="w-4 h-4" /></button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">Worker Management</h1>
          <p className="text-muted">Review KYC documents, approve or suspend workers.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search workers..." className="bg-white border border-border focus:border-blue/30 rounded-xl py-2 pl-10 pr-4 outline-none transition-all text-sm w-full sm:w-64" />
          </div>
          <button className="p-2 bg-white border border-border rounded-xl text-muted hover:bg-blue-pale transition-all"><Filter className="w-5 h-5" /></button>
        </div>
      </div>
      <DataTable columns={columns} data={workers || []} isLoading={isLoading} />
    </div>
  );
}
