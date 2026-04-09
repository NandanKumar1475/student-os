import api from './axiosInstance';

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/profile', data);