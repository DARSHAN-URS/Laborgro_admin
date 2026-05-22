'use client';

import React, { useState } from 'react';
import { Save, Globe, Shield, CreditCard, Bell } from 'lucide-react';

import { useSettings, useUpdateSettings } from '@/hooks/admin-hooks';

const sections = [
  { id: 'general',   label: 'General',        icon: Globe },
  { id: 'security',  label: 'Security',        icon: Shield },
  { id: 'payments',  label: 'Payments',        icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const { data: initialSettings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  
  const [active, setActive] = useState('general');
  const [saved, setSaved] = useState(false);
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});

  // Initialize local state when data loads
  React.useEffect(() => {
    if (initialSettings) {
      setLocalSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleChange = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: prev[key] === 'true' ? 'false' : 'true' }));
  };

  const save = () => {
    updateSettings.mutate(localSettings, {
      onSuccess: () => {
        setSaved(true); 
        setTimeout(() => setSaved(false), 2500);
      }
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">Platform Settings</h1>
          <p className="text-muted">Configure global platform behaviour and policies.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-blue hover:bg-blue-pale transition-all shadow-sm">
            <Globe className="w-4 h-4" />
            Preview Site
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar nav */}
        <div className="w-52 shrink-0 space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all
                ${active === id ? 'bg-blue text-white shadow-sm' : 'text-muted hover:bg-blue-pale hover:text-blue'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm p-8 space-y-6">
          {active === 'general' && (
            <>
              <h2 className="text-lg font-bold text-blue-dark mb-2">General Settings</h2>
              {[
                { label: 'Platform Name',    key: 'platform_name' },
                { label: 'Support Email',    key: 'support_email' },
                { label: 'Default Language', key: 'default_language' },
                { label: 'Default City',     key: 'default_city' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">{f.label}</label>
                  <input value={localSettings[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue/40 focus:ring-2 focus:ring-blue/10 outline-none text-sm transition-all" />
                </div>
              ))}
            </>
          )}
          {active === 'security' && (
            <>
              <h2 className="text-lg font-bold text-blue-dark mb-2">Security Settings</h2>
              {[
                { label: 'Session Timeout (minutes)', key: 'session_timeout' },
                { label: 'Max Login Attempts',        key: 'max_login_attempts' },
                { label: 'Admin 2FA',                 key: 'admin_2fa' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">{f.label}</label>
                  <input value={localSettings[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue/40 focus:ring-2 focus:ring-blue/10 outline-none text-sm transition-all" />
                </div>
              ))}
            </>
          )}
          {active === 'payments' && (
            <>
              <h2 className="text-lg font-bold text-blue-dark mb-2">Payment Settings</h2>
              {[
                { label: 'Platform Fee (%)',      key: 'platform_fee' },
                { label: 'Min. Payout (₹)',       key: 'min_payout' },
                { label: 'Payout Schedule',       key: 'payout_schedule' },
                { label: 'Payment Gateway',       key: 'payment_gateway' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">{f.label}</label>
                  <input value={localSettings[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue/40 focus:ring-2 focus:ring-blue/10 outline-none text-sm transition-all" />
                </div>
              ))}
            </>
          )}
          {active === 'notifications' && (
            <>
              <h2 className="text-lg font-bold text-blue-dark mb-2">Notification Settings</h2>
              {[
                { label: 'New Booking Alerts',   key: 'notify_new_booking' },
                { label: 'Dispute Alerts',       key: 'notify_dispute' },
                { label: 'Worker KYC Alerts',    key: 'notify_kyc' },
                { label: 'System Error Alerts',  key: 'notify_error' },
                { label: 'Weekly Reports',       key: 'notify_weekly' },
              ].map((f) => {
                const isOn = localSettings[f.key] === 'true';
                return (
                  <div key={f.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <span className="text-sm font-semibold text-blue-dark">{f.label}</span>
                    <button onClick={() => handleToggle(f.key)} className={`w-12 h-6 rounded-full transition-all relative ${isOn ? 'bg-blue' : 'bg-border'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isOn ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                );
              })}
            </>
          )}

          <button onClick={save} disabled={updateSettings.isPending} className="flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-dark transition-all shadow-sm mt-4 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saved ? '✓ Saved!' : (updateSettings.isPending ? 'Saving...' : 'Save Changes')}
          </button>
        </div>
      </div>
    </div>
  );
}
