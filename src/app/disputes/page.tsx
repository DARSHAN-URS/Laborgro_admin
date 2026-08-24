'use client';

import React from 'react';
import { UserPlus, CheckCircle, ArrowUpCircle, Search, Filter } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useDisputes, useResolveDispute, useEscalateDispute } from '@/hooks/admin-hooks';

export default function DisputesPage() {
  const { data: disputesData, isLoading } = useDisputes();
  const resolve = useResolveDispute();
  const escalate = useEscalateDispute();
  
  const disputes = disputesData?.data || [];

  const columns = [
    { header: 'Dispute ID', accessor: 'id' },
    { header: 'Booking ID', accessor: 'booking' },
    { header: 'Reported By', accessor: 'reportedBy', render: (v: string) => <span className="font-semibold text-blue-dark">{v}</span> },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status: string) => <StatusBadge status={status} />
    },
    { 
      header: 'Priority', 
      accessor: 'priority',
      render: (priority: string) => <StatusBadge status={priority} />
    },
    { header: 'Created Date', accessor: 'date' },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (id: string, row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'Pending' && (
            <button className="p-2 text-blue hover:bg-blue-pale rounded-lg transition-colors" title="Assign">
              <UserPlus className="w-4 h-4" />
            </button>
          )}
          {row.status !== 'RESOLVED' && row.status !== 'CLOSED' && (
             <>
              <button onClick={() => resolve.mutate(id)} disabled={resolve.isPending} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Resolve">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button onClick={() => escalate.mutate(id)} disabled={escalate.isPending} className="p-2 text-orange hover:bg-orange-bg rounded-lg transition-colors" title="Escalate">
                <ArrowUpCircle className="w-4 h-4" />
              </button>
             </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">Disputes Center</h1>
          <p className="text-muted">Resolve conflicts between clients and workers.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search disputes..." 
              className="bg-white border border-border focus:border-blue/30 rounded-xl py-2 pl-10 pr-4 outline-none transition-all text-sm w-full sm:w-64"
            />
          </div>
          <button className="p-2 bg-white border border-border rounded-xl text-muted hover:bg-blue-pale transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <DataTable 
          columns={columns} 
          data={disputes?.data || []} 
          isLoading={isLoading} 
        />
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {disputes.map((dispute: any) => (
          <div key={dispute.id} className="bg-white p-5 rounded-2xl border border-border shadow-sm">
             <div className="flex justify-between items-start mb-3">
               <div>
                  <span className="text-[10px] font-bold text-blue bg-blue-pale px-2.5 py-1 rounded-lg border border-blue-border uppercase tracking-wider">ID: {dispute.id.slice(0, 8)}</span>
                  <h3 className="font-bold text-blue-dark mt-3">Booking {dispute.booking.slice(0, 8)}</h3>
               </div>
               <StatusBadge status={dispute.status} />
             </div>
             <p className="text-sm text-muted mb-1">Reported by: <span className="font-bold text-blue-dark">{dispute.reportedBy}</span></p>
             <p className="text-xs text-muted mb-6">Date: {dispute.date}</p>
             <div className="flex gap-2">
                <button onClick={() => escalate.mutate(dispute.id)} disabled={escalate.isPending || dispute.status === 'RESOLVED'} className="flex-1 py-2.5 bg-orange-bg text-orange rounded-xl text-xs font-bold border border-orange hover:bg-orange/10 transition-colors">Escalate</button>
                <button onClick={() => resolve.mutate(dispute.id)} disabled={resolve.isPending || dispute.status === 'RESOLVED'} className="flex-1 py-2.5 bg-green-pale text-green rounded-xl text-xs font-bold border border-green-light hover:bg-green/10 transition-colors">Resolve</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
