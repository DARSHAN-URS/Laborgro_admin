'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/login') {
      router.push('/login');
    } else if (token) {
      setIsAuthenticated(true);
      if (pathname === '/login') {
        router.push('/');
      }
    }
  }, [pathname, router]);

  if (!mounted) return null; // Prevent hydration mismatch

  if (pathname === '/login') {
    return <main className="flex-1 overflow-y-auto">{children}</main>;
  }

  // If not authenticated and not on login, don't render content yet (wait for redirect)
  if (!isAuthenticated && pathname !== '/login') {
    return null; 
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-64">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
