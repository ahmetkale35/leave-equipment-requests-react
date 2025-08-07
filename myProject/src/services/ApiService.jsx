import axios from "axios";

const API_BASE_URL = "https://localhost:7012/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// ✅ Token ekleme fonksiyonu
export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

/* ===========================
      İZİN TALEPLERİ (Leaves)
=========================== */

// Bekleyen izin taleplerini getir (Admin/IT için)
export async function fetchPendingLeaves() {
    const response = await api.get("/Leaves/Pending");
    return response.data;
}

// Kendi izin taleplerini getir
export async function fetchMyLeaves() {
    const response = await api.get("/Leaves/MyRequests");
    return response.data;
}

// Yeni izin talebi oluştur
export async function createLeaveRequest(leaveData) {
    const response = await api.post("/Leaves", leaveData);
    return response.data;
}

// İzin onaylama
export async function approveLeave(id) {
    const response = await api.put(`/Leaves/${id}/approve`);
    return response.data;
}

// İzin reddetme
export async function rejectLeave(id) {
    const response = await api.put(`/Leaves/${id}/reject`);
    return response.data;
}

/* ==============================
    EKİPMAN TALEPLERİ (Equipment)
============================== */

// Bekleyen ekipman taleplerini getir
export async function fetchPendingEquipmentRequests() {
    const response = await api.get("/Equipment/Pending");
    return response.data;
}

// Kendi ekipman taleplerini getir
export async function fetchMyEquipmentRequests() {
    const response = await api.get("/Equipment/MyRequests");
    return response.data;
}

// Yeni ekipman talebi oluştur
export async function createEquipmentRequest(equipmentData) {
    const response = await api.post("/Equipment", equipmentData);
    return response.data;
}

// Ekipman onaylama
export async function approveEquipmentRequest(id) {
    const response = await api.put(`/Equipment/${id}/approve`);
    return response.data;
}

// Ekipman reddetme
export async function rejectEquipmentRequest(id) {
    const response = await api.put(`/Equipment/${id}/reject`);
    return response.data;
}
// Ekipman Stokları
export async function getAllStocks(id) {
    const response = await api.get(`/Equipment/GetAllStocks`);
    return response.data;
}

// Bütün Onaylanan Ekipmanlar - Zimmetler
export async function getAllApprovoed() {
    const response = await api.get(`/Equipment/GetAllApprovedEquipments`);
    return response.data;
}

export default api;
