'use client';

import React from 'react';
import { MapPin, Search, RefreshCw } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';

const dispatchData: any[] = [];

export default function DispatchPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">Dispatch Control</h1>
          <p className="text-muted">Track live worker assignments and on-ground status.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search dispatch..." className="bg-white border border-border focus:border-blue/30 rounded-xl py-2 pl-10 pr-4 outline-none transition-all text-sm w-full sm:w-64" />
          </div>
          <button className="p-2 bg-white border border-border rounded-xl text-muted hover:bg-blue-pale transition-all"><RefreshCw className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Live status strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Workers On-Ground', value: '0', color: 'text-green bg-green-pale border-green-light' },
          { label: 'En Route',          value: '0', color: 'text-blue bg-blue-pale border-blue-border' },
          { label: 'Pending Dispatch',  value: '0',  color: 'text-orange bg-orange-bg border-orange/20' },
        ].map((s) => (
          <div key={s.label} className={`flex flex-col items-center p-4 rounded-2xl border font-bold ${s.color}`}>
            <span className="text-3xl">{s.value}</span>
            <span className="text-xs mt-1 font-semibold opacity-80">{s.label}</span>
          </div>
        ))}
      </div>

      <DataTable
        columns={[
          { header: 'Booking',  accessor: 'id' },
          { header: 'Worker',   accessor: 'worker',   render: (v: string) => <span className="font-semibold text-blue-dark">{v}</span> },
          { header: 'Service',  accessor: 'service' },
          { header: 'Employer', accessor: 'employer', render: (v: string) => <span className="font-semibold text-blue-dark">{v}</span> },
          { header: 'Location', accessor: 'location', render: (v: string) => (
            <span className="flex items-center gap-1.5 text-muted"><MapPin className="w-3.5 h-3.5 text-blue shrink-0" />{v}</span>
          )},
          { header: 'ETA',      accessor: 'eta',      render: (v: string) => (
            <span className={`font-bold ${v === 'Arrived' ? 'text-green' : 'text-blue'}`}>{v}</span>
          )},
          { header: 'Status',   accessor: 'status',   render: (v: string) => <StatusBadge status={v} /> },
        ]}
        data={dispatchData}
      />
    </div>
  );
}
