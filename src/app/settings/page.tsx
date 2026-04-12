'use client';

import React, { useState } from 'react';
import { Save, Globe, Shield, CreditCard, Bell } from 'lucide-react';

const sections = [
  { id: 'general',   label: 'General',        icon: Globe },
  { id: 'security',  label: 'Security',        icon: Shield },
  { id: 'payments',  label: 'Payments',        icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [active, setActive] = useState('general');
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

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
                { label: 'Platform Name',    val: '' },
                { label: 'Support Email',    val: '' },
                { label: 'Default Language', val: '' },
                { label: 'Default City',     val: '' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">{f.label}</label>
                  <input defaultValue={f.val} className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue/40 focus:ring-2 focus:ring-blue/10 outline-none text-sm transition-all" />
                </div>
              ))}
            </>
          )}
          {active === 'security' && (
            <>
              <h2 className="text-lg font-bold text-blue-dark mb-2">Security Settings</h2>
              {[
                { label: 'Session Timeout (minutes)', val: '' },
                { label: 'Max Login Attempts',        val: '' },
                { label: 'Admin 2FA',                 val: '' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">{f.label}</label>
                  <input defaultValue={f.val} className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue/40 focus:ring-2 focus:ring-blue/10 outline-none text-sm transition-all" />
                </div>
              ))}
            </>
          )}
          {active === 'payments' && (
            <>
              <h2 className="text-lg font-bold text-blue-dark mb-2">Payment Settings</h2>
              {[
                { label: 'Platform Fee (%)',      val: '' },
                { label: 'Min. Payout (₹)',       val: '' },
                { label: 'Payout Schedule',       val: '' },
                { label: 'Payment Gateway',       val: '' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">{f.label}</label>
                  <input defaultValue={f.val} className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue/40 focus:ring-2 focus:ring-blue/10 outline-none text-sm transition-all" />
                </div>
              ))}
            </>
          )}
          {active === 'notifications' && (
            <>
              <h2 className="text-lg font-bold text-blue-dark mb-2">Notification Settings</h2>
              {[
                { label: 'New Booking Alerts',   on: false },
                { label: 'Dispute Alerts',       on: false },
                { label: 'Worker KYC Alerts',    on: false },
                { label: 'System Error Alerts',  on: false },
                { label: 'Weekly Reports',       on: false },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="text-sm font-semibold text-blue-dark">{f.label}</span>
                  <button className={`w-12 h-6 rounded-full transition-all relative ${f.on ? 'bg-blue' : 'bg-border'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${f.on ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </>
          )}

          <button onClick={save} className="flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-dark transition-all shadow-sm mt-4">
            <Save className="w-4 h-4" />
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
