const rawApiBase = import.meta.env.VITE_API_URL;
export const API_BASE_URL = rawApiBase ? rawApiBase.replace(/\/+$/, '') : '/api';
