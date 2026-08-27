'use client';

import React from 'react';
import { Search, Filter, UserX, RotateCcw, KeyRound } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useUsers, useSuspendUser, useReactivateUser, useResetPassword } from '@/hooks/admin-hooks';



export default function UsersPage() {
  const { data: users, isLoading, error } = useUsers();
  const suspend    = useSuspendUser();
  const reactivate = useReactivateUser();
  const resetPwd   = useResetPassword();

  const columns = [
    { header: 'User ID',   accessor: 'id' },
    { header: 'Name',      accessor: 'name',  render: (v: string) => <span className="font-semibold text-blue-dark">{v}</span> },
    { header: 'Email',     accessor: 'email' },
    { header: 'Role',      accessor: 'role',  render: (v: string) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${v === 'Employer' ? 'bg-blue-pale text-blue border-blue-border' : 'bg-green-pale text-green border-green-light'}`}>{v}</span>
    )},
    { header: 'Status',    accessor: 'status',   render: (v: string) => <StatusBadge status={v} /> },
    { header: 'Bookings',  accessor: 'bookings' },
    { header: 'Joined',    accessor: 'joined' },
    { header: 'Actions',   accessor: 'id',       render: (_: any, row: any) => (
      <div className="flex items-center gap-2">
        {row.status === 'Active'
          ? <button onClick={() => suspend.mutate({ id: row.id })} disabled={suspend.isPending} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Suspend"><UserX className="w-4 h-4" /></button>
          : <button onClick={() => reactivate.mutate(row.id)} disabled={reactivate.isPending} className="p-2 text-green hover:bg-green-pale rounded-lg transition-colors" title="Reactivate"><RotateCcw className="w-4 h-4" /></button>
        }
        <button onClick={() => resetPwd.mutate(row.id)} disabled={resetPwd.isPending} className="p-2 text-blue hover:bg-blue-pale rounded-lg transition-colors" title="Reset Password"><KeyRound className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">User Management</h1>
          <p className="text-muted">Manage all employers and workers on the platform.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search users..." className="bg-white border border-border focus:border-blue/30 rounded-xl py-2 pl-10 pr-4 outline-none transition-all text-sm w-full sm:w-64" />
          </div>
          <button className="p-2 bg-white border border-border rounded-xl text-muted hover:bg-blue-pale transition-all"><Filter className="w-5 h-5" /></button>
        </div>
      </div>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <span className="font-bold">API Error: </span>
          {(error as any)?.response?.data?.detail || (error as any)?.message || 'Failed to fetch users. Check backend connection.'}
        </div>
      )}
      <DataTable columns={columns} data={users?.data || []} isLoading={isLoading} />
    </div>
  );
}
