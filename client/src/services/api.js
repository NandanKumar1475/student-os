// client/src/services/api.js

import axios from "axios";

// ✅ Axios instance
const api = axios.create({
    baseURL: "http://localhost:8080/api", // your Spring Boot base URL
    headers: {
        "Content-Type": "application/json"
    }
});

// ✅ Optional: Attach JWT token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;