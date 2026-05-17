// client/src/services/targetService.js

import api from "../api/axiosInstance";

export const targetService = {

    getAll: () => {
        return api.get("/targets");
    },

    getById: (id) => {
        return api.get(`/targets/${id}`);
    },

    create: (data) => {
        return api.post("/targets", data);
    },

    update: (id, data) => {
        return api.put(`/targets/${id}`, data);
    },

    delete: (id) => {
        return api.delete(`/targets/${id}`);
    }

};
