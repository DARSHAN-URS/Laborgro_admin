'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  Legend
} from 'recharts';
import ChartCard from '@/components/admin/ChartCard';
import StatCard from '@/components/admin/StatCard';
import { DollarSign, TrendingUp, XCircle, Award } from 'lucide-react';

import { useAnalytics } from '@/hooks/admin-hooks';

const defaultRevenueData = [
  { month: 'Jan', revenue: 0 }
];

const defaultPerformanceData = [
  { name: 'Loading...', efficiency: 0, satisfaction: 0 }
];

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();
  
  const revenueData = data?.revenueData || defaultRevenueData;
  const performanceData = data?.performanceData || defaultPerformanceData;
  const stats = data?.stats || {
    daily_bookings: { value: '...', trend: 0, is_up: true },
    monthly_revenue: { value: '...', trend: 0, is_up: true },
    cancellation_rate: { value: '...', trend: 0, is_up: false },
    avg_worker_rating: { value: '...', trend: 0, is_up: true }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">Analytics & Insights</h1>
          <p className="text-muted">Deep dive into platform growth and performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-blue hover:bg-blue-pale transition-all shadow-sm">
            <TrendingUp className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Daily Bookings" value={String(stats.daily_bookings.value)} icon={TrendingUp} trend={{ value: stats.daily_bookings.trend, isUp: stats.daily_bookings.is_up }} />
        <StatCard title="Monthly Revenue" value={String(stats.monthly_revenue.value)} icon={DollarSign} trend={{ value: stats.monthly_revenue.trend, isUp: stats.monthly_revenue.is_up }} />
        <StatCard title="Cancellation Rate" value={String(stats.cancellation_rate.value)} icon={XCircle} trend={{ value: stats.cancellation_rate.trend, isUp: stats.cancellation_rate.is_up }} />
        <StatCard title="Avg. Worker Rating" value={String(stats.avg_worker_rating.value)} icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Revenue Trend (Last 6 Months)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde9f3" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#1a8c4e" strokeWidth={3} dot={{ fill: '#1a8c4e', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Worker Performance by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde9f3" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f0f7ff'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="efficiency" name="Efficiency %" fill="#3d7ab5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="satisfaction" name="Satisfaction %" fill="#1a8c4e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
