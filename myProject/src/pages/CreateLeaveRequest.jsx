import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateLeaveRequest() {
    const [leaveTypeId, setLeaveTypeId] = useState("");
    const [baslangicTarihi, setBaslangicTarihi] = useState("");
    const [bitisTarihi, setBitisTarihi] = useState("");
    const [aciklama, setAciklama] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const leaveTypes = [
        { Id: 1, Ad: "Yıllık İzin" },
        { Id: 2, Ad: "Hastalık İzni" },
        { Id: 3, Ad: "Mazeret İzni" },
        { Id: 4, Ad: "Doğum İzni" },
        { Id: 5, Ad: "Evlilik İzni" },
        { Id: 6, Ad: "Ölüm İzni" },
        { Id: 7, Ad: "Ücretsiz İzin" },
        { Id: 8, Ad: "Görev İzni" },
        { Id: 9, Ad: "Süt İzni" },
        { Id: 10, Ad: "Diğer" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            leaveTypeId: parseInt(leaveTypeId),
            baslangicTarihi: `${baslangicTarihi}T00:00:00`,
            bitisTarihi: `${bitisTarihi}T00:00:00`,
            aciklama,
            durum: "Bekliyor",
        };

        try {
            const res = await fetch("https://localhost:7012/api/Leaves/CreateOneLeave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("İzin talebi oluşturulamadı");

            alert("İzin talebi başarıyla oluşturuldu!");
            navigate("/my-leave-requests");
        } catch (error) {
            alert("Hata: " + error.message);
        }
    };

    return (
        <>
            <Navbar />

            <div className="pt-40 min-h-screen bg-blue-50 flex justify-center items-start px-4">
                <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-10">
                    <h2 className="text-2xl font-bold mb-8 text-indigo-900 tracking-wide drop-shadow-sm">
                        Yeni İzin Talebi Oluştur
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="leaveType" className="block mb-2 font-semibold text-indigo-800">
                                İzin Türü*:
                            </label>
                            <select
                                id="leaveType"
                                value={leaveTypeId}
                                onChange={(e) => setLeaveTypeId(e.target.value)}
                                required
                                className="w-full border border-indigo-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
                            >
                                <option value="">Seçiniz</option>
                                {leaveTypes.map((lt) => (
                                    <option key={lt.Id} value={lt.Id}>
                                        {lt.Ad}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="startDate" className="block mb-2 font-semibold text-indigo-800">
                                Başlangıç Tarihi*:
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={baslangicTarihi}
                                onChange={(e) => setBaslangicTarihi(e.target.value)}
                                required
                                className="w-full border border-indigo-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block mb-2 font-semibold text-indigo-800">
                                Bitiş Tarihi*:
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={bitisTarihi}
                                onChange={(e) => setBitisTarihi(e.target.value)}
                                required
                                className="w-full border border-indigo-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block mb-2 font-semibold text-indigo-800">
                                Açıklama:
                            </label>
                            <textarea
                                id="description"
                                value={aciklama}
                                onChange={(e) => setAciklama(e.target.value)}
                                rows={4}
                                className="w-full border border-indigo-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition resize-none"
                                placeholder="İsterseniz açıklama ekleyebilirsiniz..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            Gönder
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
