'use client';

import React from 'react';
import { Search, Filter, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useBookings, useCancelBooking, useForceCompleteBooking } from '@/hooks/admin-hooks';



export default function BookingsPage() {
  const { data: bookings, isLoading } = useBookings();
  const cancel        = useCancelBooking();
  const forceComplete = useForceCompleteBooking();

  const columns = [
    { header: 'Booking ID', accessor: 'id' },
    { header: 'Employer',   accessor: 'employer',  render: (v: string) => <span className="font-semibold text-blue-dark">{v}</span> },
    { header: 'Worker',     accessor: 'worker' },
    { header: 'Service',    accessor: 'service' },
    { header: 'Amount',     accessor: 'amount',    render: (v: string) => <span className="font-bold text-blue">{v}</span> },
    { header: 'Date',       accessor: 'date' },
    { header: 'Status',     accessor: 'status',    render: (v: string) => <StatusBadge status={v} /> },
    { header: 'Actions',    accessor: 'id',        render: (_: any, row: any) => (
      <div className="flex items-center gap-2">
        {row.status !== 'Completed' && row.status !== 'Cancelled' && (
          <>
            <button onClick={() => forceComplete.mutate(row.id)} disabled={forceComplete.isPending} className="p-2 text-green hover:bg-green-pale rounded-lg transition-colors" title="Force Complete"><CheckCircle className="w-4 h-4" /></button>
            <button onClick={() => cancel.mutate({ id: row.id })} disabled={cancel.isPending} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel"><XCircle className="w-4 h-4" /></button>
            <button className="p-2 text-blue hover:bg-blue-pale rounded-lg transition-colors" title="Reassign"><RefreshCw className="w-4 h-4" /></button>
          </>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">Bookings</h1>
          <p className="text-muted">Monitor, reassign, or cancel active bookings.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search bookings..." className="bg-white border border-border focus:border-blue/30 rounded-xl py-2 pl-10 pr-4 outline-none transition-all text-sm w-full sm:w-64" />
          </div>
          <button className="p-2 bg-white border border-border rounded-xl text-muted hover:bg-blue-pale transition-all"><Filter className="w-5 h-5" /></button>
        </div>
      </div>
      <DataTable columns={columns} data={bookings || []} isLoading={isLoading} />
    </div>
  );
}
