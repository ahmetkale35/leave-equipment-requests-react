import React, { useEffect, useState } from "react";
import { FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import {
    fetchPendingLeaves,
    approveLeave,
    rejectLeave,
    setAuthToken,
} from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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

const ITEMS_PER_PAGE = 10;

export default function Pending() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = getUserRoleFromToken();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (role !== "Admin") {
            console.warn("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            navigate("/home");
            return;
        }

        setAuthToken(token);

        fetchPendingLeaves()
            .then((data) => {
                console.log("Gelen JSON:", data); // ✅ Gelen JSON'u yazdır
                setLeaves(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Hata:", err); // ✅ Hata detayını yazdır
                setError(err.message || "Beklenmeyen bir hata oluştu.");
                setLoading(false);
            });
    }, [role, token, navigate]);

    const handleApprove = async (id) => {
        try {
            await approveLeave(id);
            setLeaves((prev) => prev.filter((leave) => leave.id !== id));
        } catch (err) {
            setError("Onaylama başarısız: " + err.message);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectLeave(id);
            setLeaves((prev) => prev.filter((leave) => leave.id !== id));
        } catch (err) {
            setError("Reddetme başarısız: " + err.message);
        }
    };

    // Sayfalama hesaplama
    const totalPages = Math.ceil(leaves.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentLeaves = leaves.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-50 via-indigo-50 to-blue-100">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-36 flex-grow overflow-hidden">
                {/* Başlık */}
                <div className="flex items-center bg-transparent rounded-lg p-4 mb-3 w-fit">
                    <FiCalendar className="text-indigo-600 mr-3" size={28} />
                    <h1 className="text-2xl font-semibold text-blue-700">Bekleyen İzin Talepleri</h1>
                </div>

                {loading ? (
                    <p className="text-center text-indigo-600 text-lg">Yükleniyor...</p>
                ) : leaves.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg bg-white py-6 rounded-xl shadow-md">
                        Bekleyen izin talebi yok.
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-2xl shadow-xl bg-white">
                        <table className="min-w-full border-collapse">
                            <thead className="sticky top-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white z-10">
                                <tr>
                                    <th className="py-4 px-6 text-left">Kullanıcı</th>
                                    <th className="py-4 px-6 text-left">İzin Tipi</th>
                                    <th className="py-4 px-6 text-left">Başlangıç</th>
                                    <th className="py-4 px-6 text-left">Bitiş</th>
                                    <th className="py-4 px-6 text-center">Toplam Gün</th>
                                    <th className="py-4 px-6 text-left">Açıklama</th>
                                    <th className="py-4 px-6 text-left">Durum</th>
                                    <th className="py-4 px-6 text-center">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLeaves.map((leave, index) => {
                                    const startDate = new Date(leave.baslangicTarihi);
                                    const endDate = new Date(leave.bitisTarihi);
                                    const totalDays =
                                        Math.floor(
                                            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
                                        ) + 1;

                                    return (
                                        <tr
                                            key={leave.id}
                                            className={`hover:bg-indigo-50 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                }`}
                                        >
                                            <td className="py-3 px-4">
                                                {leave.user?.firstName || "Bilinmiyor"} {leave.user?.lastName || ""}
                                            </td>
                                            <td className="py-3 px-4">{leave.leaveType?.ad || "-"}</td>
                                            <td className="py-3 px-4">{startDate.toLocaleDateString("tr-TR")}</td>
                                            <td className="py-3 px-4">{endDate.toLocaleDateString("tr-TR")}</td>
                                            <td className="py-3 px-4 text-center">{totalDays}</td>
                                            <td className="py-3 px-4">{leave.aciklama}</td>
                                            <td
                                                className={`py-3 px-4 font-semibold ${leave.durum === "Onaylandı"
                                                    ? "text-green-600"
                                                    : leave.durum === "Reddedildi"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                    }`}
                                            >
                                                {leave.durum}
                                            </td>
                                            <td className="py-3 px-4 flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleApprove(leave.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition duration-300 ease-in-out"
                                                    title="İzni Onayla"
                                                >
                                                    <FiCheckCircle /> Onayla
                                                </button>
                                                <button
                                                    onClick={() => handleReject(leave.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition duration-300 ease-in-out"
                                                    title="İzni Reddet"
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
                    <div className="flex justify-center mt-8 mb-10 sticky bottom-0 bg-gradient-to-tr from-blue-50 via-indigo-50 to-blue-100 py-4 z-20 space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className="px-4 py-2 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition duration-300"
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
                            className="px-4 py-2 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition duration-300"
                        >
                            İleri
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
