// src/services/ApiService.js
import axios from "axios";

const API_BASE_URL = "https://localhost:7012/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

// İzin talepleri (mevcut)
export async function fetchPendingLeaves() {
    const response = await api.get("/Leaves/Pending");
    return response.data;
}

export async function approveLeave(id) {
    const response = await api.put(`/Leaves/${id}/approve`);
    return response.data;
}

export async function rejectLeave(id) {
    const response = await api.put(`/Leaves/${id}/reject`);
    return response.data;
}

// --- Yeni ekipman talepleri fonksiyonları ---

export async function fetchPendingEquipmentRequests() {
    const response = await api.get("/Equipment/Pending");
    return response.data;
}

export async function approveEquipmentRequest(id) {
    const response = await api.put(`/Equipment/${id}/approve`);
    return response.data;
}

export async function rejectEquipmentRequest(id) {
    const response = await api.put(`/Equipment/${id}/reject`);
    return response.data;
}
