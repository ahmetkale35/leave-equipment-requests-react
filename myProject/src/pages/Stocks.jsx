import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    CircularProgress,
    TextField,
} from "@mui/material";
import { getAllStocks, setAuthToken } from "../services/ApiService";

export default function MyStockList() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [darkMode, setDarkMode] = useState(true);
    const [search, setSearch] = useState("");

    const filteredStocks = stocks.filter((stock) =>
        stock.ad?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedStocks = filteredStocks.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const fetchStocks = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            setAuthToken(token);

            const data = await getAllStocks();

            if (Array.isArray(data)) {
                setStocks(data);
            } else {
                setStocks([]);
            }
        } catch (err) {
            setError("Stok listesi alınamadı");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
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
                    className={`shadow-2xl rounded-2xl p-8 max-w-6xl mx-auto ${darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    {/* Başlık ve Dark Mode */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">Stok Listesi</h1>
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
                            label="Ara (Ad)"
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
                    ) : stocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] bg-indigo-50 dark:bg-gray-700 rounded-xl border border-indigo-200 shadow-inner p-8">
                            <h2 className="text-2xl font-semibold mb-2">Hiç stok bulunamadı</h2>
                            <p className="text-indigo-500 dark:text-gray-300">
                                Henüz stok kaydınız bulunmamaktadır.
                            </p>
                        </div>
                    ) : filteredStocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] bg-indigo-50 dark:bg-gray-700 rounded-xl border border-indigo-200 shadow-inner p-8">
                            <h2 className="text-2xl font-semibold mb-2">Filtreleme sonucu bulunamadı</h2>
                            <p className="text-indigo-500 dark:text-gray-300">
                                Arama kriterlerinizi değiştirin veya yeni stok ekleyin.
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
                                            {["Id", "Ad", "Boşta", "Kullanılan", "Toplam", "Durum"].map((header) => (
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
                                        {paginatedStocks.map((stock) => {
                                            const total = (stock.adet || 0) + (stock.atanan || 0)
                                            const used = stock.atanan || 0;
                                            const percent = total > 0 ? (used / total) * 100 : 0;

                                            return (
                                                <tr
                                                    key={stock.id}
                                                    className={`hover:transition-colors duration-200 cursor-default ${darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50"
                                                        }`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {stock.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {stock.ad ?? "—"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {stock.adet ?? "—"}
                                                    </td>
                                                    {/* Kullanılan sayı */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {used}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {total ?? "—"}
                                                    </td>
                                                    {/* Durum Bar */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <div className="w-full min-w-[150px]">
                                                            <div className="flex items-center justify-between mb-1 text-xs">
                                                                <span>{percent.toFixed(2)}%</span>
                                                            </div>
                                                            <div className="relative w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                                                                <div
                                                                    className="h-3 rounded-full transition-all"
                                                                    style={{
                                                                        width: `${percent}%`,
                                                                        backgroundColor:
                                                                            percent >= 80
                                                                                ? "#f44336" // kırmızı
                                                                                : percent >= 50
                                                                                    ? "#ff9800" // turuncu
                                                                                    : "#4caf50" // yeşil
                                                                    }}
                                                                ></div>
                                                                <span
                                                                    className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white"
                                                                    style={{ textShadow: "0 0 3px rgba(0,0,0,0.6)" }}
                                                                >
                                                                    {/* {percent.toFixed(0)}% */}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
