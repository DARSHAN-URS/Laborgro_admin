'use client';

import React from 'react';
import { UserPlus, CheckCircle, ArrowUpCircle, Search, Filter } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useDisputes } from '@/hooks/admin-hooks';

export default function DisputesPage() {
  const { data: disputes, isLoading } = useDisputes();

  const mockDisputes = [
    { id: 'DIS-101', booking: 'BK-5231', reportedBy: 'Grace Hopper', status: 'Pending', priority: 'High', date: '2024-03-12' },
    { id: 'DIS-102', booking: 'BK-4890', reportedBy: 'Worker: John Smith', status: 'Processing', priority: 'Medium', date: '2024-03-11' },
    { id: 'DIS-103', booking: 'BK-9912', reportedBy: 'Bill Gates', status: 'Resolved', priority: 'Low', date: '2024-03-10' },
  ];

  const columns = [
    { header: 'Dispute ID', accessor: 'id' },
    { header: 'Booking ID', accessor: 'booking' },
    { header: 'Reported By', accessor: 'reportedBy' },
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
          {row.status !== 'Resolved' && (
             <>
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Resolve">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-orange hover:bg-orange-bg rounded-lg transition-colors" title="Escalate">
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
          data={disputes || mockDisputes} 
          isLoading={isLoading} 
        />
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {(disputes || mockDisputes).map((dispute: any) => (
          <div key={dispute.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-start mb-3">
               <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">ID: {dispute.id}</span>
                  <h3 className="font-bold text-gray-900 mt-2">Booking {dispute.booking}</h3>
               </div>
               <StatusBadge status={dispute.status} />
             </div>
             <p className="text-sm text-gray-600 mb-1">Reported by: <span className="font-medium">{dispute.reportedBy}</span></p>
             <p className="text-xs text-gray-500 mb-4">Date: {dispute.date}</p>
             <div className="flex gap-2">
                <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">Manage</button>
                <button className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold">Resolve</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
