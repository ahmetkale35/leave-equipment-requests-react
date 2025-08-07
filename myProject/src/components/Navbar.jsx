import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';

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
        //localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    // Menü Öğeleri 
    let menuItems = [];

    if (role === 'Admin') {
        //  Admin için sadece yönetim sekmeleri
        menuItems = [
            { to: '/home', label: 'Ana Sayfa' },
            { to: '/manage-leaves', label: 'İzin Talepleri Yönet' },
            { to: '/manage-equipments', label: 'Ekipman Talepleri Yönet' },
            { to: '/stocks', label: 'Stok Durumu' },
            { to: '/approved', label: 'Zimmetler' }

        ];
    } else {
        //  Normal kullanıcı ve IT için default sekmeler
        menuItems = [
            { to: '/home', label: 'Ana Sayfa' },
            { to: '/my-leave-requests', label: 'İzin Taleplerim' },
            { to: '/create-leave', label: 'İzin Talebi Oluştur' },
            { to: '/create-equipment', label: 'Ekipman Talebi' },
            { to: '/my-equipment-requests', label: 'Ekipman Taleplerim' },
        ];

        //  IT rolüne ek olarak yönetim sekmesi
        if (role === 'It') {
            menuItems.push({ to: '/manage-equipments', label: 'Ekipman Talepleri Yönet' });
            menuItems.push({ to: '/stocks', label: 'Stok Durumu' });
        }
    }

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] z-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl px-8 py-4 flex justify-between items-center backdrop-blur-md border border-white/20">

            <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
                {/* Menü öğeleri */}
                <div className="flex space-x-8">
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
                <div className="flex space-x-8">
                    {/* Logout butonu */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex justify-end items-center bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-all duration-300"
                    >
                        <FiLogOut className="mr-2" /> Çıkış
                    </button>
                </div>


            </div>
        </nav>
    );
}
