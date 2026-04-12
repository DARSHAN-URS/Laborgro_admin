'use client';

import React from 'react';
import { Activity, Server, Database, Cpu, CheckCircle, AlertTriangle } from 'lucide-react';
import { useHealth } from '@/hooks/admin-hooks';

const recentErrors: any[] = [];

export default function MonitoringPage() {
  const { data, isLoading } = useHealth();
  const health = data || {};

  const services = [
    { key: 'api',      label: 'API Server',    icon: Server },
    { key: 'database', label: 'Database',      icon: Database },
    { key: 'storage',  label: 'File Storage',  icon: Cpu },
    { key: 'workers',  label: 'Background Jobs', icon: Activity },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">System Monitoring</h1>
          <p className="text-muted">Real-time health pulse of the Laborgro infrastructure.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-blue hover:bg-blue-pale transition-all shadow-sm">
            <Activity className="w-4 h-4 text-green animate-pulse" />
            Refresh Status
          </button>
        </div>
      </div>

      {/* Service Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(({ key, label, icon: Icon }) => {
          const svc = (health as any)[key] || { status: 'unknown', latency: '—', uptime: '—' };
          const ok  = svc.status === 'healthy';
          return (
            <div key={key} className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ok ? 'bg-green-pale' : 'bg-red-50'}`}>
                  <Icon className={`w-5 h-5 ${ok ? 'text-green' : 'text-red-500'}`} />
                </div>
                {ok
                  ? <span className="flex items-center gap-1 text-xs font-bold text-green bg-green-pale px-2.5 py-1 rounded-full border border-green-light"><CheckCircle className="w-3 h-3" />Online</span>
                  : <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100"><AlertTriangle className="w-3 h-3" />Down</span>
                }
              </div>
              <h3 className="font-bold text-blue-dark text-sm mb-3">{label}</h3>
              <div className="space-y-1.5 text-xs text-muted">
                <div className="flex justify-between"><span>Latency</span><span className="font-semibold text-blue-dark">{svc.latency}</span></div>
                <div className="flex justify-between"><span>Uptime</span><span className="font-semibold text-green">{svc.uptime}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall uptime bar */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <h2 className="font-bold text-blue-dark mb-4">30-Day Uptime</h2>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className={`h-8 flex-1 min-w-[10px] rounded-sm ${i === 12 || i === 24 ? 'bg-orange/60' : 'bg-green/80'}`} title={`Day ${i + 1}`} />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted">
          <span>30 days ago</span>
          <span className="font-bold text-green">99.93% overall uptime</span>
          <span>Today</span>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange" />
          <h2 className="font-bold text-blue-dark">Recent Errors</h2>
        </div>
        <div className="divide-y divide-border">
          {recentErrors.map((e, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-blue-pale/20 transition-colors">
              <span className="text-xs font-mono text-muted w-12 shrink-0">{e.time}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100">{e.code}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-pale text-blue border border-blue-border">{e.service}</span>
              <span className="text-sm text-muted flex-1">{e.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
