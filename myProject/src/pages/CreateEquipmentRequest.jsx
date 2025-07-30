import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateEquipmentRequest() {
    const [equipmentItemId, setEquipmentItemId] = useState("");
    const [adet, setAdet] = useState("");
    const [aciklama, setAciklama] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const equipmentItems = [
        { Id: 1, Name: "Laptop" },
        { Id: 2, Name: "Monitor" },
        { Id: 3, Name: "Keyboard" },
        { Id: 4, Name: "Mouse" },
        { Id: 5, Name: "Printer" },
        { Id: 6, Name: "Scanner" },
        { Id: 7, Name: "Headset" },
        { Id: 8, Name: "Webcam" },
        { Id: 9, Name: "Docking Station" },
        { Id: 10, Name: "Projector" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            EquipmentItemId: parseInt(equipmentItemId),
            adet: parseInt(adet),
            Açıklama: aciklama,
            durum: "Bekliyor",
            talepTarihi: new Date().toISOString(),
        };

        try {
            const res = await fetch(
                "https://localhost:7012/api/Equipment/CreateOneEquipment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Ekipman talebi oluşturulamadı");

            alert("Ekipman talebi başarıyla oluşturuldu!");
            navigate("/my-equipment-requests");
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
                        Yeni Ekipman Talebi Oluştur
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="equipmentItem"
                                className="block mb-2 font-semibold text-indigo-800"
                            >
                                Ekipman Türü*:
                            </label>
                            <select
                                id="equipmentItem"
                                value={equipmentItemId}
                                onChange={(e) => setEquipmentItemId(e.target.value)}
                                required
                                className="w-full border border-indigo-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
                            >
                                <option value="">Seçiniz</option>
                                {equipmentItems.map((item) => (
                                    <option key={item.Id} value={item.Id}>
                                        {item.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="adet"
                                className="block mb-2 font-semibold text-indigo-800"
                            >
                                Adet*:
                            </label>
                            <input
                                id="adet"
                                type="number"
                                min="1"
                                value={adet}
                                onChange={(e) => setAdet(e.target.value)}
                                required
                                placeholder="Talep edilen adet"
                                className="w-full border border-indigo-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="aciklama"
                                className="block mb-2 font-semibold text-indigo-800"
                            >
                                Açıklama:
                            </label>
                            <textarea
                                id="aciklama"
                                value={aciklama}
                                onChange={(e) => setAciklama(e.target.value)}
                                rows={4}
                                placeholder="İsterseniz açıklama ekleyebilirsiniz..."
                                className="w-full border border-indigo-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition resize-none"
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
