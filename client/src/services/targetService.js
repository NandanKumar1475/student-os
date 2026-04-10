// client/src/services/targetService.js

import axios from "axios";

// 👉 Base URL (Spring Boot backend)
const API_URL = "http://localhost:8080/api/targets";

export const targetService = {

    // ✅ Get all targets
    getAll: () => {
        return axios.get(API_URL);
    },

    // ✅ Get target by ID
    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    // ✅ Create new target
    create: (data) => {
        return axios.post(API_URL, data);
    },

    // ✅ Update target
    update: (id, data) => {
        return axios.put(`${API_URL}/${id}`, data);
    },

    // ✅ Delete target
    delete: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    }

};