'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';

// ── Dashboard ─────────────────────────────────────────────────────────────────
// Response shape: { metrics: { total_bookings, active_workers, pending_verifications },
//                   system_health: { api, database, background_workers },
//                   active_incidents }
export const useAdminDashboard = () =>
  useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboardSummary,
    staleTime: 30_000,
  });

// ── Users ─────────────────────────────────────────────────────────────────────
export const useUsers = (params?: { skip?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: ['admin-users', params],
    queryFn:  () => adminApi.getUsers(params),
  });

export const useSuspendUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminApi.suspendUser(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useReactivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.reactivateUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useResetPassword = () =>
  useMutation({ mutationFn: (id: string) => adminApi.resetUserPassword(id) });

// ── Workers ───────────────────────────────────────────────────────────────────
export const useWorkers = (params?: { skip?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: ['admin-workers', params],
    queryFn:  () => adminApi.getWorkers(params),
  });

export const useApproveWorker = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.approveWorker(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-workers'] }),
  });
};

export const useRejectWorker = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminApi.rejectWorker(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-workers'] }),
  });
};

export const useSuspendWorker = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminApi.suspendWorker(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-workers'] }),
  });
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const useBookings = (params?: { skip?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: ['admin-bookings', params],
    queryFn:  () => adminApi.getBookings(params),
  });

export const useCancelBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminApi.cancelBooking(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });
};

export const useForceCompleteBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.forceCompleteBooking(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });
};

export const useReassignBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, newWorkerId }: { bookingId: string; newWorkerId: string }) =>
      adminApi.reassignBooking(bookingId, newWorkerId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });
};

// ── Disputes (stub — backend endpoint TBD) ────────────────────────────────────
export const useDisputes = (params?: any) =>
  useQuery({
    queryKey: ['admin-disputes', params],
    queryFn:  () => adminApi.getDisputes(params),
  });

// ── Analytics (stub) ──────────────────────────────────────────────────────────
export const useAnalytics = (params?: any) =>
  useQuery({
    queryKey: ['admin-analytics', params],
    queryFn:  () => adminApi.getAnalytics(params),
  });

// ── Health (root /health endpoint) ───────────────────────────────────────────
export const useHealth = () =>
  useQuery({
    queryKey: ['admin-health'],
    queryFn:  adminApi.getHealth,
    refetchInterval: 30_000,
  });
