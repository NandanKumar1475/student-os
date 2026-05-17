import api from './api';

export const jobService = {
  getJobs: (type) => api.get('/jobs', { params: type ? { type } : {} }),
  getResources: () => api.get('/jobs', { params: { type: 'RESOURCE' } }),
};
