import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fw_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fw_token');
      localStorage.removeItem('fw_user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verify2FA: (data) => api.post('/auth/verify-2fa', data),
  enable2FA: () => api.post('/auth/enable-2fa'),
  disable2FA: () => api.post('/auth/disable-2fa'),
  googleLogin: (data) => api.post('/auth/google', data),
  facebookLogin: (data) => api.post('/auth/facebook', data),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updateProfilePicture: (data) => api.put('/users/profile/picture', data),
  changePassword: (data) => api.put('/users/profile/password', data),
  getAllUsers: (params) => api.get('/users/all', { params }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// ─── Trainers ─────────────────────────────────────────────────────────────────
export const trainerAPI = {
  getAll: () => api.get('/trainers'),
  getById: (id) => api.get(`/trainers/${id}`),
  create: (data) => api.post('/trainers', data),
  update: (id, data) => api.put(`/trainers/${id}`, data),
  delete: (id) => api.delete(`/trainers/${id}`),
};

// ─── Plans ────────────────────────────────────────────────────────────────────
export const planAPI = {
  getAll: () => api.get('/plans'),
  getById: (id) => api.get(`/plans/${id}`),
  create: (data) => api.post('/plans', data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  delete: (id) => api.delete(`/plans/${id}`),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingAPI = {
  getMyBookings: () => api.get('/bookings/my'),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  adminGetAll: (params) => api.get('/bookings/admin/all', { params }),
  adminUpdateStatus: (id, status) => api.put(`/bookings/admin/${id}/status`, { status }),
};

// ─── Supplements ──────────────────────────────────────────────────────────────
// ─── Supplements (Legacy, keeping for compatibility) ──────────────────────────
export const supplementAPI = {
  getAll: () => api.get('/supplements'),
  create: (data) => api.post('/supplements', data),
  update: (id, data) => api.put(`/supplements/${id}`, data),
  delete: (id) => api.delete(`/supplements/${id}`),
};

// ─── Membership Purchases ──────────────────────────────────────────────────────
export const membershipPurchaseAPI = {
  apply: (formData) => api.post('/memberships/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyPurchases: () => api.get('/memberships/my'),
  adminGetAll: () => api.get('/admin/memberships'),
  adminGetById: (id) => api.get(`/admin/memberships/${id}`),
  adminApprove: (id, data) => api.put(`/admin/memberships/${id}/approve`, data),
  adminReject: (id, data) => api.put(`/admin/memberships/${id}/reject`, data),
  adminSaveMessage: (id, data) => api.put(`/admin/memberships/${id}/message`, data)
};

// ─── Store Products (New Shop) ─────────────────────────────────────────────────
export const storeProductAPI = {
  getAll: () => api.get('/store/products'),
  getById: (id) => api.get(`/store/products/${id}`),
  adminGetAll: () => api.get('/admin/store/products'),
  adminCreate: (data) => api.post('/admin/store/products', data),
  adminUpdate: (id, data) => api.put(`/admin/store/products/${id}`, data),
  adminDelete: (id) => api.delete(`/admin/store/products/${id}`)
};

// ─── Store Orders ──────────────────────────────────────────────────────────────
export const storeOrderAPI = {
  create: (formData) => api.post('/store/orders', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyOrders: () => api.get('/store/orders/my'),
  adminGetAll: () => api.get('/admin/store/orders'),
  adminApprove: (id, data) => api.put(`/admin/store/orders/${id}/approve`, data),
  adminReject: (id, data) => api.put(`/admin/store/orders/${id}/reject`, data),
  adminUpdateStatus: (id, data) => api.put(`/admin/store/orders/${id}/status`, data)
};

export default api;
