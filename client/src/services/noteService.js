// client/src/services/noteService.js

import api from './api';

export const noteService = {
    getAll: () => api.get('/notes'),
    getById: (id) => api.get(`/notes/${encodeURIComponent(id)}`),
    search: (query) => api.get('/notes/search', { params: { query } }),
    getByTag: (tag) => api.get(`/notes/tag/${encodeURIComponent(tag)}`),
    getTags: () => api.get('/notes/tags'),
    create: (data) => api.post('/notes', data),
    update: (id, data) => api.put(`/notes/${encodeURIComponent(id)}`, data),
    togglePin: (id) => api.patch(`/notes/${encodeURIComponent(id)}/pin`),
    delete: (id) => api.delete(`/notes/${encodeURIComponent(id)}`),
};