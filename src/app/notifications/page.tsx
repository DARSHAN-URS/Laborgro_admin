'use client';

import React, { useState } from 'react';
import { Send, Users, User, Bell } from 'lucide-react';

const sentNotifications: any[] = [];

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!title || !message) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setTitle(''); setMessage(''); setTarget('all');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-blue-dark">Notifications</h1>
        <p className="text-muted">Broadcast push notifications to users, workers, or employers.</p>
      </div>

      {/* Compose */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-blue-dark flex items-center gap-2"><Bell className="w-5 h-5 text-blue" /> Send Notification</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'all',      label: 'All Users',  icon: Users },
            { value: 'workers',  label: 'Workers Only', icon: User },
            { value: 'employers',label: 'Employers Only', icon: User },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.value} onClick={() => setTarget(t.value)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 font-semibold text-sm transition-all
                  ${target === t.value ? 'border-blue bg-blue-pale text-blue' : 'border-border text-muted hover:border-blue/30'}`}>
                <Icon className="w-5 h-5" />{t.label}
              </button>
            );
          })}
        </div>

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title..."
          className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue/40 focus:ring-2 focus:ring-blue/10 outline-none text-sm transition-all" />
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Write your message here..."
          className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue/40 focus:ring-2 focus:ring-blue/10 outline-none text-sm transition-all resize-none" />

        <button onClick={handleSend} disabled={sending || !title || !message}
          className="flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-dark transition-all disabled:opacity-50 shadow-sm">
          {sending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : <><Send className="w-4 h-4" />Send Notification</>}
        </button>
        {sent && <p className="text-green text-sm font-semibold">✓ Notification sent successfully!</p>}
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-blue-dark">Sent History</h2>
        </div>
        <div className="divide-y divide-border">
          {sentNotifications.map((n) => (
            <div key={n.id} className="flex items-start gap-4 px-6 py-4 hover:bg-blue-pale/20 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-blue-pale flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-blue" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-blue-dark">{n.title}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-pale text-blue border border-blue-border uppercase">{n.target}</span>
                </div>
                <p className="text-sm text-muted">{n.msg}</p>
                <p className="text-xs text-muted/70 mt-1">{n.sent}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
