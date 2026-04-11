// client/src/services/noteService.js

import api from './api';

export const noteService = {
    getAll: () => api.get('/notes'),
    getById: (id) => api.get(`/notes/${id}`),
    search: (query) => api.get(`/notes/search?query=${query}`),
    getByTag: (tag) => api.get(`/notes/tag/${tag}`),
    getTags: () => api.get('/notes/tags'),
    create: (data) => api.post('/notes', data),
    update: (id, data) => api.put(`/notes/${id}`, data),
    togglePin: (id) => api.patch(`/notes/${id}/pin`),
    delete: (id) => api.delete(`/notes/${id}`),
};