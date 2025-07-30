import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    FiCalendar,
    FiPlusSquare,
    FiUser,
    FiSettings,
    FiPackage,
    FiClipboard
} from 'react-icons/fi';

function getUserRoleFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (error) {
        console.error("Token decode hatası:", error);
        return null;
    }
}

export default function Home() {
    const navigate = useNavigate();
    const role = getUserRoleFromToken();

    useEffect(() => {
        if (!role) navigate('/login');
    }, [role, navigate]);

    const cards = [];

    // Normal kullanıcı için
    if (role === 'Employee') {
        cards.push(
            {
                title: 'İzin Taleplerim',
                description: 'Kendi izin taleplerinizi görüntüleyin',
                path: '/my-leave-requests',
                icon: <FiClipboard size={28} />,
            },
            {
                title: 'İzin Talebi Oluştur',
                description: 'Yeni izin talebi yapın',
                path: '/create-leave',
                icon: <FiPlusSquare size={28} />,
            },
            {
                title: 'Ekipman Talebi Oluştur',
                description: 'Yeni ekipman talebi yapın',
                path: '/create-equipment',
                icon: <FiPackage size={28} />,
            },
            {
                title: 'Ekipman Taleplerim',
                description: 'Taleplerinizi görüntüleyin',
                path: '/my-equipment-requests',
                icon: <FiUser size={28} />,
            }
        );
    }

    // Admin için sadece yönetim kartları
    if (role === 'Admin') {
        cards.push(
            {
                title: 'İzin Talepleri Yönet',
                description: 'Tüm izin taleplerini yönetin',
                path: '/manage-leaves',
                icon: <FiCalendar size={28} />,
            },
            {
                title: 'Ekipman Talepleri Yönet',
                description: 'Tüm ekipman taleplerini yönetin',
                path: '/manage-equipments',
                icon: <FiSettings size={28} />,
            }
        );
    }

    // IT için yönetim + talepler
    if (role === 'It') {
        cards.push(
            {
                title: 'İzin Talebi Oluştur',
                description: 'Yeni izin talebi yapın',
                path: '/create-leave',
                icon: <FiPlusSquare size={28} />,
            },
            {
                title: 'İzin Taleplerim',
                description: 'Kendi izin taleplerinizi görüntüleyin',
                path: '/my-leave-requests',
                icon: <FiClipboard size={28} />,
            },
            {
                title: 'Ekipman Talebi Oluştur',
                description: 'Yeni ekipman talebi yapın',
                path: '/create-equipment',
                icon: <FiPackage size={28} />,
            },
            {
                title: 'Ekipman Taleplerim',
                description: 'Taleplerinizi görüntüleyin',
                path: '/my-equipment-requests',
                icon: <FiUser size={28} />,
            },
            {
                title: 'Ekipman Talepleri Yönet',
                description: 'Tüm ekipman taleplerini yönetin',
                path: '/manage-equipments',
                icon: <FiSettings size={28} />,
            }
        );
    }

    const roleColors = {
        Admin: 'from-purple-500 to-indigo-600',
        Employee: 'from-green-400 to-blue-500',
        It: 'from-orange-400 to-yellow-500'
    };

    const gradient = roleColors[role] || 'from-indigo-400 to-blue-500';

    return (
        <div className="relative min-h-screen bg-gradient-to-tr from-blue-50 via-indigo-50 to-blue-100 p-8 pt-40">
            <Navbar />

            {/* Dekoratif Blur Bloblar */}
            <div className="absolute top-28 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

            {/* Kartlar */}
            <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        onClick={() => navigate(card.path)}
                        className={`cursor-pointer bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between border-4 border-transparent transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-rotate-1 hover:border-gradient-to-r hover:from-indigo-500 hover:to-purple-600 w-72`}
                    >
                        {/* İkon */}
                        <div className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${gradient} text-white shadow-md mb-4`}>
                            {card.icon}
                        </div>
                        <h2 className="text-2xl font-semibold text-indigo-800">{card.title}</h2>
                        <p className="text-gray-600 flex-grow mt-2 leading-relaxed">{card.description}</p>

                        {/* Buton */}
                        <button
                            className={`mt-6 w-full py-2 rounded-lg bg-gradient-to-r ${gradient} text-white shadow hover:shadow-xl hover:brightness-110 hover:scale-105 transition-all duration-300`}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(card.path);
                            }}
                        >
                            Git →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
