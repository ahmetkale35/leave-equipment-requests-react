import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { CircularProgress, TextField } from "@mui/material";
import { getAllApprovoed, setAuthToken } from "../services/ApiService";

export default function AllApprovedRequests() {
    const [requests, setApproved] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [darkMode, setDarkMode] = useState(true);
    const [search, setSearch] = useState("");

    // ✅ Filtreleme
    const filteredRequests = requests.filter((req) =>
        req.userName?.toLowerCase().includes(search.toLowerCase()) ||
        req.equipmentItem?.ad?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // ✅ API Çağrısı
    const fetchApprovedRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            setAuthToken(token);

            const data = await getAllApprovoed(); // API fonksiyonunu kullanıyoruz
            if (Array.isArray(data)) {
                setApproved(data);
            } else {
                setApproved([]);
            }
        } catch (err) {
            setError("Veriler alınamadı");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedRequests();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString || dateString === "0001-01-01T00:00:00") return "—";
        return new Date(dateString).toLocaleDateString("tr-TR");
    };

    return (
        <>
            <Navbar />
            <div
                className={`pt-40 min-h-screen px-6 ${darkMode
                    ? "bg-gray-900 text-gray-200"
                    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100"
                    }`}
            >
                <div
                    className={`shadow-2xl rounded-2xl p-8 max-w-7xl mx-auto ${darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    {/* Başlık ve Dark Mode */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">Onaylanmış Talepler</h1>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                            {darkMode ? "🌞 Light" : "🌙 Dark"}
                        </button>
                    </div>

                    {/* Ara */}
                    <div className="mb-6 w-full md:w-64">
                        <TextField
                            label="Ara (Kullanıcı / Ekipman)"
                            variant="outlined"
                            size="small"
                            fullWidth
                            InputProps={{
                                style: {
                                    color: darkMode ? "#fff" : "#111",
                                    backgroundColor: darkMode ? "#374151" : "#fff",
                                    borderRadius: "8px",
                                    height: "36px",
                                    fontSize: "14px",
                                    padding: "4px 8px",
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                                style: {
                                    color: darkMode ? "#d1d5db" : "#4b5563",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                },
                            }}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {/* İçerik */}
                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <CircularProgress color="primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 font-semibold">{error}</div>
                    ) : requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] bg-indigo-50 dark:bg-gray-700 rounded-xl border border-indigo-200 shadow-inner p-8">
                            <h2 className="text-2xl font-semibold mb-2">Hiç kayıt bulunamadı</h2>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] bg-indigo-50 dark:bg-gray-700 rounded-xl border border-indigo-200 shadow-inner p-8">
                            <h2 className="text-2xl font-semibold mb-2">Filtreleme sonucu bulunamadı</h2>
                        </div>
                    ) : (
                        <>
                            {/* Tablo */}
                            <div
                                className={`overflow-x-auto rounded-lg border shadow-md ${darkMode ? "border-gray-600 bg-gray-700" : "border-indigo-200 bg-white"
                                    }`}
                            >
                                <table className="table-fixed w-full min-w-full divide-y">
                                    <thead
                                        className={`${darkMode ? "bg-gray-600 text-gray-300" : "bg-indigo-100 text-indigo-800"
                                            }`}
                                    >
                                        <tr>
                                            {["Id", "Kullanıcı Adı", "Ekipman Adı", "Talep Tarihi", "Adet", "Durum"].map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide select-none"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody
                                        className={`divide-y ${darkMode
                                            ? "divide-gray-600 bg-gray-800 text-white"
                                            : "divide-indigo-200 bg-white text-black"
                                            }`}
                                    >
                                        {paginatedRequests.map((req) => (
                                            <tr
                                                key={req.id}
                                                className={`hover:transition-colors duration-200 cursor-default ${darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50"
                                                    }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {req.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {req.user
                                                        ? `${req.user.firstName} ${req.user.lastName}`
                                                        : req.userId ?? "—"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {req.equipmentItem?.ad ?? "—"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {formatDate(req.talepTarihi)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {req.adet ?? "—"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold select-none
                                                        ${req.durum === "Onaylandı"
                                                                ? darkMode
                                                                    ? "bg-green-900 text-green-400"
                                                                    : "bg-green-100 text-green-800"
                                                                : darkMode
                                                                    ? "bg-yellow-900 text-yellow-400"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                    >
                                                        {req.durum}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-6 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Önceki
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-4 py-2 rounded-full ${currentPage === i + 1
                                            ? "bg-indigo-800 text-white"
                                            : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Sonraki
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
