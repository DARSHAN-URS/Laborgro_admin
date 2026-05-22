import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API  = `${BASE}/api/v1`;

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to /login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  /**
   * POST /api/v1/admin/auth/login
   * Body: { email, password }
   * Returns: { access_token, token_type, user: { id, email, role, is_active, last_login } }
   */
  login: (email: string, password: string) =>
    api.post('/admin/auth/login', { email, password }).then(res => res.data),

  /**
   * POST /api/v1/admin/auth/logout
   */
  logout: () => api.post('/admin/auth/logout').then(res => res.data),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
// GET /api/v1/admin/dashboard/summary
// Returns: { metrics: { total_bookings, active_workers, pending_verifications },
//            system_health: { api, database, background_workers },
//            active_incidents }
const getDashboardSummary = () =>
  api.get('/admin/dashboard/summary').then(res => res.data);

// ── Users ─────────────────────────────────────────────────────────────────────
// GET  /api/v1/admin/users?skip=0&limit=20&search=
// POST /api/v1/admin/users/suspend?user_id=&reason=
// POST /api/v1/admin/users/reactivate?user_id=
// POST /api/v1/admin/users/reset-password?user_id=
const getUsers = (params?: { skip?: number; limit?: number; search?: string }) =>
  api.get('/admin/users', { params }).then(res => res.data);

const suspendUser = (userId: string, reason: string = 'Admin action') =>
  api.post('/admin/users/suspend', null, { params: { user_id: userId, reason } }).then(res => res.data);

const reactivateUser = (userId: string) =>
  api.post('/admin/users/reactivate', null, { params: { user_id: userId } }).then(res => res.data);

const resetUserPassword = (userId: string) =>
  api.post('/admin/users/reset-password', null, { params: { user_id: userId } }).then(res => res.data);

// ── Workers ───────────────────────────────────────────────────────────────────
// GET  /api/v1/admin/workers?skip=0&limit=20&search=
// POST /api/v1/admin/workers/approve?worker_id=
// POST /api/v1/admin/workers/reject?worker_id=&reason=
// POST /api/v1/admin/workers/suspend?worker_id=&reason=
const getWorkers = (params?: { skip?: number; limit?: number; search?: string }) =>
  api.get('/admin/workers', { params }).then(res => res.data);

const approveWorker = (workerId: string) =>
  api.post('/admin/workers/approve', null, { params: { worker_id: workerId } }).then(res => res.data);

const rejectWorker = (workerId: string, reason: string = 'Admin rejection') =>
  api.post('/admin/workers/reject', null, { params: { worker_id: workerId, reason } }).then(res => res.data);

const suspendWorker = (workerId: string, reason: string = 'Admin action') =>
  api.post('/admin/workers/suspend', null, { params: { worker_id: workerId, reason } }).then(res => res.data);

// ── Bookings ──────────────────────────────────────────────────────────────────
// GET  /api/v1/admin/bookings?skip=0&limit=20&search=
// POST /api/v1/admin/bookings/reassign?booking_id=&new_worker_id=
// POST /api/v1/admin/bookings/cancel?booking_id=&reason=
// POST /api/v1/admin/bookings/force-complete?booking_id=
const getBookings = (params?: { skip?: number; limit?: number; search?: string }) =>
  api.get('/admin/bookings', { params }).then(res => res.data);

const reassignBooking = (bookingId: string, newWorkerId: string) =>
  api.post('/admin/bookings/reassign', null, { params: { booking_id: bookingId, new_worker_id: newWorkerId } }).then(res => res.data);

const cancelBooking = (bookingId: string, reason: string = 'Admin cancellation') =>
  api.post('/admin/bookings/cancel', null, { params: { booking_id: bookingId, reason } }).then(res => res.data);

const forceCompleteBooking = (bookingId: string) =>
  api.post('/admin/bookings/force-complete', null, { params: { booking_id: bookingId } }).then(res => res.data);

// ── Disputes ──────────────────────────────────────────────────────────────────
const getDisputes = (params?: { skip?: number; limit?: number; search?: string }) =>
  api.get('/admin/disputes', { params }).then(res => res.data);

const resolveDispute = (disputeId: string) =>
  api.post(`/admin/disputes/${disputeId}/resolve`).then(res => res.data);

const escalateDispute = (disputeId: string) =>
  api.post(`/admin/disputes/${disputeId}/escalate`).then(res => res.data);

// ── Old admin router (Supabase-direct) ────────────────────────────────────────
// GET  /api/v1/admin/dashboard   (legacy)
// POST /api/v1/admin/workers/{id}/approve (legacy)
const getHealth = () => api.get('/health', { baseURL: BASE }).then(res => res.data);

// ── Analytics ─────────────────────────────────────────────────────────────────
const getAnalytics = (params?: any) =>
  api.get('/admin/analytics', { params }).then(res => res.data);

// ── Dispatch ──────────────────────────────────────────────────────────────────
const getDispatch = () => api.get('/admin/dispatch/active').then(res => res.data);
const assignWorker = (bookingId: string, workerId: string) => 
  api.post('/admin/dispatch/assign', null, { params: { booking_id: bookingId, worker_id: workerId } }).then(res => res.data);

// ── Notifications ─────────────────────────────────────────────────────────────
const getNotifications = () => api.get('/admin/notifications').then(res => res.data);
const broadcastNotification = (payload: { title: string; message: string; target: string }) =>
  api.post('/admin/notifications/broadcast', payload).then(res => res.data);

// ── Settings ──────────────────────────────────────────────────────────────────
const getSettings = () => api.get('/admin/settings').then(res => res.data);
const updateSettings = (settings: Record<string, string>) =>
  api.put('/admin/settings', { settings }).then(res => res.data);

// ── Unified export ───────────────────────────────────────────────────────────
export const adminApi = {
  getDashboardSummary,
  getUsers,
  suspendUser,
  reactivateUser,
  resetUserPassword,
  getWorkers,
  approveWorker,
  rejectWorker,
  suspendWorker,
  getBookings,
  reassignBooking,
  cancelBooking,
  forceCompleteBooking,
  getHealth,
  getDisputes,
  resolveDispute,
  escalateDispute,
  getAnalytics,
  getDispatch,
  assignWorker,
  getNotifications,
  broadcastNotification,
  getSettings,
  updateSettings,
};

export default api;
