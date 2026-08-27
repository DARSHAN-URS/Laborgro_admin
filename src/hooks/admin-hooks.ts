'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, CreateWorkerPayload } from '@/lib/api';

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

export const useCreateWorker = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWorkerPayload) => adminApi.createWorker(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-workers'] }),
  });
};


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

// ── Disputes ──────────────────────────────────────────────────────────────────
export const useDisputes = (params?: { skip?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: ['admin-disputes', params],
    queryFn:  () => adminApi.getDisputes(params),
  });

export const useResolveDispute = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.resolveDispute(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-disputes'] }),
  });
};

export const useEscalateDispute = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.escalateDispute(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-disputes'] }),
  });
};

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

// ── Dispatch ──────────────────────────────────────────────────────────────────
export const useDispatch = () =>
  useQuery({
    queryKey: ['admin-dispatch'],
    queryFn: adminApi.getDispatch,
    refetchInterval: 15_000, // Auto-refresh every 15 seconds
  });

export const useAssignWorker = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, workerId }: { bookingId: string; workerId: string }) => 
      adminApi.assignWorker(bookingId, workerId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-dispatch'] }),
  });
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const useNotifications = () =>
  useQuery({
    queryKey: ['admin-notifications'],
    queryFn: adminApi.getNotifications,
  });

export const useBroadcastNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; message: string; target: string }) => 
      adminApi.broadcastNotification(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-notifications'] }),
  });
};

// ── Settings ──────────────────────────────────────────────────────────────────
export const useSettings = () =>
  useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminApi.getSettings,
  });

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: Record<string, string>) => adminApi.updateSettings(settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-settings'] }),
  });
};
