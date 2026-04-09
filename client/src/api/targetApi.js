import api from './axiosInstance';

export const getAllTargets = (params) => api.get('/targets', { params });
export const getTarget = (id) => api.get(`/targets/${id}`);
export const createTarget = (data) => api.post('/targets', data);
export const updateTarget = (id, data) => api.put(`/targets/${id}`, data);
export const deleteTarget = (id) => api.delete(`/targets/${id}`);
export const toggleFocus = (id) => api.put(`/targets/${id}/focus`);
export const updateProgress = (id, progress) => api.put(`/targets/${id}/progress`, { progress });