'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import Logo from '@/components/Logo';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      // Store JWT + user info
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#dde9f3] p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Logo size="xl" stacked />
          <h2 className="text-sm font-bold text-[#6b7f93] mt-2 uppercase tracking-widest">Admin Portal</h2>
          <p className="text-sm text-[#6b7f93] mt-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Restricted access — authorised personnel only
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm">
            <span className="font-bold block">Login Failed</span>{error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#6b7f93] uppercase tracking-wider mb-2">Admin Email</label>
            <input
              id="email" type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@laborgro.in"
              className="w-full px-4 py-3 rounded-xl border border-[#dde9f3] focus:border-[#3d7ab5] focus:ring-2 focus:ring-[#3d7ab5]/10 outline-none text-sm transition-all"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[#6b7f93] uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                id="password" type={show ? 'text' : 'password'} required autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#dde9f3] focus:border-[#3d7ab5] focus:ring-2 focus:ring-[#3d7ab5]/10 outline-none text-sm transition-all pr-12"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7f93] hover:text-[#3d7ab5]">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-[#3d7ab5] text-white py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#1a2533] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              : 'Sign In to Admin Panel'
            }
          </button>
        </form>
      </div>
    </div>
  );
}
