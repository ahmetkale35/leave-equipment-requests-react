import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

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

export default function Navbar() {
    const navigate = useNavigate();
    const role = getUserRoleFromToken();

    const handleLogout = () => {

        localStorage.removeItem('token');
        setAuthToken(null);
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    // Menü Öğeleri (role'e göre düzenleniyor)
    let menuItems = [];

    if (role === 'Admin') {
        // ✅ Admin için sadece yönetim sekmeleri
        menuItems = [
            { to: '/home', label: 'Ana Sayfa' },
            { to: '/manage-leaves', label: 'İzin Talepleri Yönet' },
            { to: '/manage-equipments', label: 'Ekipman Talepleri Yönet' }
        ];
    } else {
        // ✅ Normal kullanıcı ve IT için default sekmeler
        menuItems = [
            { to: '/home', label: 'Ana Sayfa' },
            { to: '/my-leave-requests', label: 'İzin Taleplerim' },
            { to: '/create-leave', label: 'İzin Talebi Oluştur' },
            { to: '/create-equipment', label: 'Ekipman Talebi' },
            { to: '/my-equipment-requests', label: 'Ekipman Taleplerim' },
        ];

        // ✅ IT rolüne ek olarak yönetim sekmesi
        if (role === 'It') {
            menuItems.push({ to: '/manage-equipments', label: 'Ekipman Talepleri Yönet' });
        }
    }

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 shadow-lg py-5">
            <div className="max-w-7xl mx-auto px-8 flex items-center">

                {/* Menü öğeleri - ortada eşit aralık */}
                <div className="flex-1 flex justify-center space-x-8">
                    {menuItems.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `text-white font-semibold px-5 py-3 rounded-full transition whitespace-nowrap ${isActive
                                    ? 'bg-indigo-900 bg-opacity-30'
                                    : 'hover:bg-indigo-800 hover:bg-opacity-25'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* Logout Butonu - en sağda */}
                <button
                    onClick={handleLogout}
                    className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-full shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300 whitespace-nowrap ml-8"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
