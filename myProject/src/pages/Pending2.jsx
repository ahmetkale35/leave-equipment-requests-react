import React, { useEffect, useState } from "react";
import { FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Burada API servislerini kendi ApiService dosyana göre import et
import {
    fetchPendingEquipmentRequests,
    approveEquipmentRequest,
    rejectEquipmentRequest,
    setAuthToken,
} from "../services/ApiService";

function getUserRoleFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (error) {
        console.error("Token decode hatası:", error);
        return null;
    }
}

export default function Pending2() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = getUserRoleFromToken();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (role !== "Admin") {
            navigate("/home");
            return;
        }

        setAuthToken(token);

        fetchPendingEquipmentRequests()
            .then((data) => {
                setRequests(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Beklenmeyen hata oluştu.");
                setLoading(false);
            });
    }, [role, token, navigate]);

    const handleApprove = async (id) => {
        try {
            await approveEquipmentRequest(id);
            setRequests((prev) => prev.filter((req) => req.id !== id));
        } catch (err) {
            alert("Onaylama başarısız: " + err.message);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectEquipmentRequest(id);
            setRequests((prev) => prev.filter((req) => req.id !== id));
        } catch (err) {
            alert("Reddetme başarısız: " + err.message);
        }
    };



    const totalPages = Math.ceil(requests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRequests = requests.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-50 via-indigo-50 to-blue-100">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-36 flex-grow overflow-hidden">
                {/* Başlık */}
                <div className="flex items-center bg-transparent rounded-lg p-4 mb-3 w-fit">
                    <FiCalendar className="text-indigo-600 mr-3" size={28} />
                    <h1 className="text-2xl font-semibold text-blue-700">
                        Bekleyen Ekipman Talepleri
                    </h1>
                </div>
                {loading ? (
                    <p className="text-center text-indigo-600 text-lg">Yükleniyor...</p>
                ) : requests.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg bg-white py-6 rounded-xl shadow-md">
                        Bekleyen Ekipman talebi yok.
                    </p>
                ) : (

                    <div className="overflow-x-auto rounded-2xl shadow-xl bg-white">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white">
                                    <th className="py-4 px-6 text-left">Kullanıcı</th>
                                    <th className="py-4 px-6 text-left">Ekipman Tipi</th>
                                    <th className="py-4 px-6 text-center">Adet</th>
                                    <th className="py-4 px-6 text-left">Açıklama</th>
                                    <th className="py-4 px-6 text-left">Durum</th>
                                    <th className="py-4 px-6 text-center">Talep Tarihi</th>
                                    <th className="py-4 px-6 text-center">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRequests.map((req, index) => {
                                    const talepTarihiDate = new Date(req.talepTarihi);
                                    const talepTarihiFormatted =
                                        req.talepTarihi && req.talepTarihi !== "0001-01-01T00:00:00"
                                            ? talepTarihiDate.toLocaleDateString("tr-TR")
                                            : "—";

                                    return (
                                        <tr
                                            key={req.id}
                                            className={`hover:bg-indigo-50 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                }`}
                                        >
                                            <td className="py-3 px-4">
                                                {req.user?.firstName || "Bilinmiyor"}{" "}
                                                {req.user?.lastName || ""}
                                            </td>
                                            <td className="py-3 px-4">{req.equipmentItem?.ad || "-"}</td>
                                            <td className="py-3 px-4 text-center">{req.adet}</td>
                                            <td className="py-3 px-4">{req.açıklama || "-"}</td>
                                            <td className="py-3 px-4 font-semibold text-yellow-600">
                                                {req.durum}
                                            </td>
                                            <td className="py-3 px-4 text-center">{talepTarihiFormatted}</td>
                                            <td className="py-3 px-4 flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
                                                >
                                                    <FiCheckCircle /> Onayla
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
                                                >
                                                    <FiXCircle /> Reddet
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Sayfalama */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 mb-10 space-x-2 sticky bottom-0 bg-gradient-to-tr from-blue-50 via-indigo-50 to-blue-100 py-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className="px-4 py-2 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition"
                        >
                            Geri
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-4 py-2 rounded-lg ${currentPage === i + 1
                                    ? "bg-purple-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className="px-4 py-2 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition"
                        >
                            İleri
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
