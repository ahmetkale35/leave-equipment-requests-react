import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { fetchMyEquipmentRequests, setAuthToken } from "../services/ApiService";

export default function MyEquipmentRequests() {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [darkMode, setDarkMode] = useState(true);
    const [filter, setFilter] = useState({ search: "", durum: "" });

    const filteredEquipments = equipments.filter((eq) => {
        const searchText = filter.search.toLowerCase();
        const durumMatch = filter.durum ? eq.durum === filter.durum : true;
        const searchMatch =
            eq.equipmentItem?.ad.toLowerCase().includes(searchText) ||
            (eq.açıklama?.toLowerCase().includes(searchText) ?? false);
        return durumMatch && searchMatch;
    });

    const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEquipments = filteredEquipments.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const fetchEquipments = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            setAuthToken(token);

            const data = await fetchMyEquipmentRequests();

            if (Array.isArray(data)) {
                setEquipments(data);
            } else {
                setEquipments([]);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setEquipments([]); // Kullanıcının hiç ekipman talebi yok
            } else {
                setError("Ekipman talepleri alınamadı");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipments();
    }, []);

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
                        <h1 className="text-3xl font-bold tracking-tight">Ekipman Taleplerim</h1>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                            {darkMode ? "🌞 Light" : "🌙 Dark"}
                        </button>
                    </div>

                    {/* Filtre Alanı */}
                    <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0">
                        {/* Ara */}
                        <div className="md:mr-12 w-full md:w-40">
                            <TextField
                                label="Ara"
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
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                            />
                        </div>

                        {/* Durum */}
                        <div className="w-full md:w-36">
                            <FormControl
                                size="small"
                                fullWidth
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: darkMode ? "#374151" : "#fff",
                                        color: darkMode ? "#fff" : "#111",
                                        borderRadius: "8px",
                                        height: "36px",
                                        fontSize: "14px",
                                        "& fieldset": { borderColor: darkMode ? "#4b5563" : "#cbd5e1" },
                                        "&:hover fieldset": { borderColor: "#6366f1" },
                                    },
                                    "& .MuiInputLabel-root": {
                                        position: "absolute",
                                        top: "-8px",
                                        left: "12px",
                                        fontSize: "16px",
                                        fontWeight: 700,
                                        color: darkMode ? "#d1d5db" : "#4b5563",
                                        marginBottom: "4px",
                                    },
                                }}
                            >
                                <InputLabel shrink={true}>Durum</InputLabel>
                                <Select
                                    value={filter.durum}
                                    onChange={(e) => {
                                        setFilter({ ...filter, durum: e.target.value });
                                        setCurrentPage(1);
                                    }}
                                >
                                    <MenuItem value="">Tümü</MenuItem>
                                    <MenuItem value="Onaylandı">Onaylandı</MenuItem>
                                    <MenuItem value="Reddedildi">Reddedildi</MenuItem>
                                    <MenuItem value="Beklemede">Beklemede</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    {/* İçerik */}
                    {loading ? (
                        <div className="flex justify-center items-center h-[400px]">
                            <CircularProgress color="primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 font-semibold">{error}</div>
                    ) : equipments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] bg-indigo-50 dark:bg-gray-700 rounded-xl border border-indigo-200 shadow-inner p-8">
                            <h2 className="text-2xl font-semibold mb-2">Hiç kayıtlı ekipman talebi yok</h2>
                            <p className="text-indigo-500 dark:text-gray-300">
                                Henüz hiç ekipman talebi oluşturmamışsınız.
                            </p>
                        </div>
                    ) : filteredEquipments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] bg-indigo-50 dark:bg-gray-700 rounded-xl border border-indigo-200 shadow-inner p-8">
                            <h2 className="text-2xl font-semibold mb-2">Filtreleme sonucu bulunamadı</h2>
                            <p className="text-indigo-500 dark:text-gray-300">
                                Filtreleri temizleyin veya yeni talep oluşturun.
                            </p>
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
                                            {["Ekipman Tipi", "Adet", "Açıklama", "Durum", "Onaylayan", "Talep Tarihi"].map(
                                                (header) => (
                                                    <th
                                                        key={header}
                                                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide select-none"
                                                    >
                                                        {header}
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody
                                        className={`divide-y ${darkMode
                                            ? "divide-gray-600 bg-gray-800 text-white"
                                            : "divide-indigo-200 bg-white text-black"
                                            }`}
                                    >
                                        {paginatedEquipments.map((eq) => (
                                            <tr
                                                key={eq.id}
                                                className={`hover:transition-colors duration-200 cursor-default ${darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50"
                                                    }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {eq.equipmentItem?.ad ?? "—"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{eq.adet}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {eq.açıklama || "—"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold select-none ${eq.durum === "Onaylandı"
                                                            ? darkMode
                                                                ? "bg-green-900 text-green-400"
                                                                : "bg-green-100 text-green-800"
                                                            : eq.durum === "Reddedildi"
                                                                ? darkMode
                                                                    ? "bg-red-900 text-red-400"
                                                                    : "bg-red-100 text-red-800"
                                                                : darkMode
                                                                    ? "bg-yellow-900 text-yellow-400"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                    >
                                                        {eq.durum}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {eq.onaylayan
                                                        ? `${eq.onaylayan.firstName} ${eq.onaylayan.lastName}`
                                                        : "—"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {eq.talepTarihi && eq.talepTarihi !== "0001-01-01T00:00:00"
                                                        ? new Date(eq.talepTarihi).toLocaleDateString("tr-TR")
                                                        : "—"}
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
