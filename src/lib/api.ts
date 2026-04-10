import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const adminApi = {
  getDashboardSummary: () => api.get('/admin/dashboard/summary').then(res => res.data),
  getUsers: (params?: any) => api.get('/admin/users', { params }).then(res => res.data),
  suspendUser: (userId: string) => api.post(`/admin/users/${userId}/suspend`),
  reactivateUser: (userId: string) => api.post(`/admin/users/${userId}/reactivate`),
  resetUserPassword: (userId: string) => api.post(`/admin/users/${userId}/reset-password`),
  getWorkers: (params?: any) => api.get('/admin/workers', { params }).then(res => res.data),
  approveWorker: (workerId: string) => api.post(`/admin/workers/${workerId}/approve`),
  rejectWorker: (workerId: string) => api.post(`/admin/workers/${workerId}/reject`),
  suspendWorker: (userId: string) => api.post(`/admin/workers/${userId}/suspend`),
  getBookings: (params?: any) => api.get('/admin/bookings', { params }).then(res => res.data),
  reassignBooking: (bookingId: string, data: any) => api.put(`/admin/bookings/${bookingId}/reassign`, data),
  cancelBooking: (bookingId: string) => api.post(`/admin/bookings/${bookingId}/cancel`),
  forceCompleteBooking: (bookingId: string) => api.post(`/admin/bookings/${bookingId}/force-complete`),
  getDisputes: (params?: any) => api.get('/admin/disputes', { params }).then(res => res.data),
  assignDispute: (disputeId: string, data: any) => api.post(`/admin/disputes/${disputeId}/assign`, data),
  resolveDispute: (disputeId: string, data: any) => api.post(`/admin/disputes/${disputeId}/resolve`, data),
  escalateDispute: (disputeId: string) => api.post(`/admin/disputes/${disputeId}/escalate`),
  getAnalytics: (params?: any) => api.get('/admin/analytics/dashboard', { params }).then(res => res.data),
  getHealth: () => api.get('/admin/monitoring/health').then(res => res.data),
};

export default api;
