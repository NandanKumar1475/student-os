// client/src/services/taskService.js

import api from './api';

export const taskService = {
    getAll: () => api.get('/tasks'),
    getToday: () => api.get('/tasks/today'),
    getUpcoming: () => api.get('/tasks/upcoming'),
    getCompleted: () => api.get('/tasks/completed'),
    create: (data) => api.post('/tasks', data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    toggle: (id) => api.patch(`/tasks/${id}/toggle`),
    delete: (id) => api.delete(`/tasks/${id}`),
};