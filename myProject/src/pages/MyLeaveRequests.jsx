import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    TextField,
} from "@mui/material";

const TableColumnHeader = ({ column, title }) => (
    <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide select-none">
        {title}
    </th>
);

const TableRow = ({ leave, darkMode }) => (
    <tr
        key={leave.id}
        className={`hover:${darkMode ? "bg-gray-600" : "bg-indigo-50"} transition`}
    >
        <td className="px-6 py-4 font-semibold">{leave.leaveType?.ad ?? "—"}</td>
        <td className="px-6 py-4">
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
                new Date(leave.baslangicTarihi)
            )}
        </td>
        <td className="px-6 py-4">
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
                new Date(leave.bitisTarihi)
            )}
        </td>
        <td className="px-6 py-4">{leave.aciklama || "—"}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold select-none ${leave.durum === "Onaylandı"
                        ? darkMode
                            ? "bg-green-900 text-green-400"
                            : "bg-green-100 text-green-800"
                        : leave.durum === "Reddedildi"
                            ? darkMode
                                ? "bg-red-900 text-red-400"
                                : "bg-red-100 text-red-800"
                            : darkMode
                                ? "bg-yellow-900 text-yellow-400"
                                : "bg-yellow-100 text-yellow-800"
                    }`}
            >
                {leave.durum}
            </span>
        </td>
    </tr>
);

export default function MyLeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );
    const [filter, setFilter] = useState({ durum: "", search: "" });
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    "https://localhost:7012/api/Leaves/MyRequests",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const data = await response.json();

                if (
                    response.status === 404 &&
                    data.Message &&
                    data.Message.includes("has no leave requests")
                ) {
                    setLeaves([]);
                    setFilteredLeaves([]);
                    setError(null);
                } else if (response.status >= 400) {
                    throw new Error("İzinler alınamadı");
                } else {
                    const leavesData = Array.isArray(data) ? data : [];
                    setLeaves(leavesData);
                    setFilteredLeaves(leavesData);
                    setError(null);
                }
            } catch (err) {
                console.log("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaves();
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    useEffect(() => {
        let filtered = leaves;
        if (filter.durum) {
            filtered = filtered.filter((l) => l.durum === filter.durum);
        }
        if (filter.search) {
            filtered = filtered.filter(
                (l) =>
                    l.leaveType?.ad
                        ?.toLowerCase()
                        .includes(filter.search.toLowerCase()) ||
                    l.aciklama?.toLowerCase().includes(filter.search.toLowerCase())
            );
        }
        setFilteredLeaves(filtered);
        setCurrentPage(1);
    }, [filter, leaves]);

    const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
    const paginatedLeaves = filteredLeaves.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <>
            <Navbar />
            <div
                className={`pt-40 min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100"
                    } px-6`}
            >
                <div
                    className={`shadow-2xl rounded-2xl p-8 max-w-7xl mx-auto ${darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">İzin Taleplerim</h1>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                            {darkMode ? "🌞 Light" : "🌙 Dark"}
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0">
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
                                    onChange={(e) => setFilter({ ...filter, durum: e.target.value })}
                                >
                                    <MenuItem value="">Tümü</MenuItem>
                                    <MenuItem value="Onaylandı">Onaylandı</MenuItem>
                                    <MenuItem value="Reddedildi">Reddedildi</MenuItem>
                                    <MenuItem value="Beklemede">Beklemede</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-[400px]">
                            <CircularProgress color="primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 font-semibold">{error}</div>
                    ) : leaves.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] bg-indigo-50 dark:bg-gray-700 rounded-xl border border-indigo-200 shadow-inner p-8">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-20 w-20 text-indigo-400 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14m-9 4h4"
                                />
                            </svg>
                            <h2 className="text-2xl font-semibold mb-2">Hiç kayıtlı izin yok</h2>
                            <p className="text-indigo-500 dark:text-gray-300">
                                Henüz hiç izin talebi oluşturmamışsınız.
                            </p>
                        </div>
                    ) : filteredLeaves.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] bg-indigo-50 dark:bg-gray-700 rounded-xl border border-indigo-200 shadow-inner p-8">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-20 w-20 text-indigo-400 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14m-9 4h4"
                                />
                            </svg>
                            <h2 className="text-2xl font-semibold mb-2">Filtreleme sonucu bulunamadı</h2>
                            <p className="text-indigo-500 dark:text-gray-300">
                                Filtreleri temizleyin veya yeni izin oluşturun.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Masaüstü Tablo */}
                            <div className="hidden md:block overflow-x-auto rounded-lg border border-indigo-200 shadow-lg">
                                <table className="w-full text-sm text-left">
                                    <thead
                                        className={`${darkMode
                                                ? "bg-gray-700 text-gray-200"
                                                : "bg-indigo-100 text-indigo-800"
                                            } uppercase text-xs font-bold`}
                                    >
                                        <tr>
                                            {[
                                                "İzin Türü",
                                                "Başlangıç",
                                                "Bitiş",
                                                "Açıklama",
                                                "Durum",
                                            ].map((header) => (
                                                <TableColumnHeader key={header} title={header} />
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-indigo-200">
                                        {paginatedLeaves.map((leave) => (
                                            <TableRow
                                                key={leave.id}
                                                leave={leave}
                                                darkMode={darkMode}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobil Kart Görünümü */}
                            <div className="md:hidden space-y-4">
                                {paginatedLeaves.map((leave) => (
                                    <div
                                        key={leave.id}
                                        className={`rounded-xl shadow-md p-4 ${darkMode ? "bg-gray-700" : "bg-white"
                                            } transition`}
                                    >
                                        <h3 className="font-bold text-lg">
                                            {leave.leaveType?.ad ?? "—"}
                                        </h3>
                                        <p>
                                            <strong>Başlangıç:</strong>{" "}
                                            {new Intl.DateTimeFormat("tr-TR", {
                                                dateStyle: "medium",
                                            }).format(new Date(leave.baslangicTarihi))}
                                        </p>
                                        <p>
                                            <strong>Bitiş:</strong>{" "}
                                            {new Intl.DateTimeFormat("tr-TR", {
                                                dateStyle: "medium",
                                            }).format(new Date(leave.bitisTarihi))}
                                        </p>
                                        <p>
                                            <strong>Açıklama:</strong> {leave.aciklama || "—"}
                                        </p>
                                        <p>
                                            <strong>Durum:</strong>{" "}
                                            <span
                                                className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${leave.durum === "Onaylandı"
                                                        ? "bg-green-100 text-green-700"
                                                        : leave.durum === "Reddedildi"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {leave.durum}
                                            </span>
                                        </p>
                                    </div>
                                ))}
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
