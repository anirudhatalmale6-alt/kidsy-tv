import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3500/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const adminLogin = (data) => api.post('/auth/admin/login', data);

// Dashboard
export const getDashboardStats = () => api.get('/users/admin/dashboard');

// Categories
export const getCategories = () => api.get('/categories/admin');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Channels
export const getChannels = () => api.get('/channels/admin');
export const createChannel = (data) => api.post('/channels', data);
export const updateChannel = (id, data) => api.put(`/channels/${id}`, data);
export const deleteChannel = (id) => api.delete(`/channels/${id}`);

// Videos
export const getVideos = () => api.get('/videos/admin');
export const createVideo = (data) => api.post('/videos', data);
export const updateVideo = (id, data) => api.put(`/videos/${id}`, data);
export const deleteVideo = (id) => api.delete(`/videos/${id}`);

// Users
export const getUsers = () => api.get('/users/admin/all');
export const toggleUser = (id) => api.put(`/users/admin/${id}/toggle`);
export const deleteUser = (id) => api.delete(`/users/admin/${id}`);

export default api;
