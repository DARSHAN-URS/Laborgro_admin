'use client';

import React, { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, UserX, UserPlus, X, Loader2 } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useWorkers, useApproveWorker, useRejectWorker, useSuspendWorker, useCreateWorker } from '@/hooks/admin-hooks';

export default function WorkersPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    city: 'Mumbai',
    hourly_rate: 500,
    experience_years: 2,
    skills: 'Plumbing, Repair',
    bio: 'Experienced field worker.',
    is_verified: true,
    is_available: true,
  });

  const { data: workers, isLoading } = useWorkers({ search: search || undefined });
  const approve = useApproveWorker();
  const reject  = useRejectWorker();
  const suspend = useSuspendWorker();
  const createWorker = useCreateWorker();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    createWorker.mutate(
      {
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email || undefined,
        city: formData.city,
        hourly_rate: Number(formData.hourly_rate),
        experience_years: Number(formData.experience_years),
        skills: skillsArray,
        bio: formData.bio,
        is_verified: formData.is_verified,
        is_available: formData.is_available,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({
            full_name: '',
            phone: '',
            email: '',
            city: 'Mumbai',
            hourly_rate: 500,
            experience_years: 2,
            skills: 'Plumbing, Repair',
            bio: 'Experienced field worker.',
            is_verified: true,
            is_available: true,
          });
        },
      }
    );
  };

  const columns = [
    { header: 'Worker ID', accessor: 'id', render: (v: string) => <span className="font-mono text-xs text-slate-500">{v ? v.substring(0, 8) + '...' : '—'}</span> },
    { header: 'Name',      accessor: 'name',     render: (v: string) => <span className="font-semibold text-blue-dark">{v}</span> },
    { header: 'Email / Phone', accessor: 'email', render: (_: any, row: any) => (
      <div className="text-xs">
        <p className="font-medium text-slate-700">{row.email || 'No Email'}</p>
        <p className="text-slate-400">{row.phone || row.city || '—'}</p>
      </div>
    )},
    { header: 'City',      accessor: 'city', render: (v: string, row: any) => v || row.city || 'Mumbai' },
    { header: 'Rating',    accessor: 'rating',   render: (v: any) => <span className="font-bold text-amber-500">⭐ {v || '5.0'}</span> },
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
          <p className="text-muted">Create worker profiles, review KYC documents, approve or suspend workers.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search workers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-border focus:border-blue/30 rounded-xl py-2 pl-10 pr-4 outline-none transition-all text-sm w-full sm:w-64"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Worker</span>
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={workers?.data || []} isLoading={isLoading} />

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-800 text-lg">Create New Worker Profile</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {createWorker.isError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">
                  Failed to create worker profile. Please try again.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="rahul@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hourly Rate (₹) *</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    required
                    min="0"
                    value={formData.hourly_rate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience_years"
                    min="0"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g. Plumbing, Wiring, Repair"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bio / Profile Notes</label>
                <textarea
                  name="bio"
                  rows={2}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Brief description of worker qualifications..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={formData.is_verified}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>Mark as Verified (KYC Approved)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>Mark as Available for Hire</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createWorker.isPending}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {createWorker.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{createWorker.isPending ? 'Adding Worker...' : 'Create Worker Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

