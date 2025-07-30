// pages/NotAuthorized.jsx
import React from 'react';

export default function NotAuthorized() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
            <h1 className="text-5xl font-bold text-red-500 mb-4">Erişim Reddedildi</h1>
            <p className="text-lg text-gray-600">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
    );
}
