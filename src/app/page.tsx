'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users, HardHat, CalendarCheck, AlertTriangle,
  DollarSign, TrendingUp, Activity, ArrowRight,
  CheckCircle, Clock, XCircle, BarChart3
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { useAdminDashboard } from '@/hooks/admin-hooks';

const recentActivity: any[] = [];

const quickLinks = [
  { label: 'Manage Users',    href: '/users',         icon: Users,         color: 'text-blue bg-blue-pale' },
  { label: 'Approve Workers', href: '/workers',        icon: HardHat,       color: 'text-green bg-green-pale' },
  { label: 'View Bookings',   href: '/bookings',       icon: CalendarCheck, color: 'text-blue bg-blue-pale' },
  { label: 'Resolve Disputes',href: '/disputes',       icon: AlertTriangle, color: 'text-orange bg-orange-bg' },
  { label: 'Analytics',       href: '/analytics',      icon: BarChart3,     color: 'text-blue bg-blue-pale' },
  { label: 'System Health',   href: '/monitoring',     icon: Activity,      color: 'text-green bg-green-pale' },
];

export default function DashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">Dashboard Overview</h1>
          <p className="text-muted mt-1">Welcome back, Admin — here's what's happening on Laborgro today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-green bg-green-pale px-4 py-2 rounded-full border border-green-light">
          <span className="w-2 h-2 bg-green rounded-full animate-pulse inline-block"></span>
          Platform Online
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings"       value={data?.metrics?.total_bookings         ?? '—'} icon={CalendarCheck} trend={{ value: 8,  isUp: true  }} />
        <StatCard title="Active Workers"        value={data?.metrics?.active_workers          ?? '—'} icon={HardHat}       trend={{ value: 11, isUp: true  }} />
        <StatCard title="Pending Verifications" value={data?.metrics?.pending_verifications    ?? '—'} icon={AlertTriangle} trend={{ value: 2,  isUp: false }} />
        <StatCard title="Active Incidents"      value={data?.active_incidents ?? 0}             icon={Activity}      />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="API Status"    value={data?.system_health?.api                ?? '—'} icon={TrendingUp}  />
        <StatCard title="Database"      value={data?.system_health?.database            ?? '—'} icon={DollarSign}  />
        <StatCard title="Background Jobs" value={data?.system_health?.background_workers ?? '—'} icon={Users}      />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-bold text-blue-dark">Recent Activity</h2>
            <Link href="/bookings" className="text-xs font-bold text-blue hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-blue-pale/20 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold
                  ${item.type === 'Booking'  ? 'bg-blue-pale text-blue'
                  : item.type === 'Dispute' ? 'bg-orange-bg text-orange'
                  : item.type === 'Worker'  ? 'bg-green-pale text-green'
                  : 'bg-blue-pale text-blue'}`}>
                  {item.type[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-blue-dark truncate">{item.desc}</p>
                  <p className="text-xs text-muted mt-0.5">{item.id} · {item.time}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-bold text-blue-dark">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-pale/40 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${link.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-blue-dark group-hover:text-blue transition-colors">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
