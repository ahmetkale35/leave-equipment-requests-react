import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';  // Navbar'ı import ettik

export default function LeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Kullanıcı giriş yapmamış');
                    setLoading(false);
                    return;
                }

                const response = await fetch('https://localhost:7012/api/Leaves/GetAllLeaves', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Veri çekme başarısız');

                const data = await response.json();
                setLeaves(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaves();
    }, []);

    if (loading) return <p className="text-center mt-10 text-gray-600">Yükleniyor...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-50 via-indigo-50 to-blue-100">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-36 flex-grow overflow-hidden">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">İzin Talepleri</h1>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-600">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Kullanıcı Adı</th>
                                    <th className="px-6 py-3">İzin Tipi</th>
                                    <th className="px-6 py-3">Başlangıç</th>
                                    <th className="px-6 py-3">Bitiş</th>
                                    <th className="px-6 py-3">Açıklama</th>
                                    <th className="px-6 py-3">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500">Veri bulunamadı</td>
                                    </tr>
                                ) : (
                                    leaves.map((leave, index) => (
                                        <tr
                                            key={leave.id}
                                            className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">{leave.user?.userName || '-'}</td>
                                            <td className="px-6 py-4">{leave.leaveType?.ad || '-'}</td>
                                            <td className="px-6 py-4">{new Date(leave.baslangicTarihi).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">{new Date(leave.bitisTarihi).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">{leave.aciklama}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${leave.durum === 'Onaylandı'
                                                        ? 'bg-green-100 text-green-700'
                                                        : leave.durum === 'Bekliyor'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {leave.durum}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
