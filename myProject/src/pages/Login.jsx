import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('https://localhost:7012/api/authentication/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error('Kullanıcı adı veya şifre hatalı!');

            const data = await response.json();
            const token = data.token;

            // Token'ı kaydet
            localStorage.setItem('token', token);

            // Token'ın doğru kaydedildiğini kontrol et
            const savedToken = localStorage.getItem('token');
            if (savedToken !== token) {
                throw new Error('Token kaydedilemedi!');
            }

            // Token'ı decode et ve kontrol et
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            if (!role) {
                throw new Error('Geçersiz token formatı!');
            }

            console.log('Kullanıcı Rolü:', role);

            // Token'ın localStorage'a yazılmasını bekle, sonra yönlendir
            setTimeout(() => {
                navigate('/home');
            }, 100);

        } catch (err) {
            setError(err.message);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-indigo-500 to-purple-600 p-6">
            <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full">
                <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Giriş Yap</h2>

                {error && (
                    <div className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <label className="block">
                        <span className="text-gray-700 font-semibold mb-1 block">Kullanıcı Adı</span>
                        <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                            autoComplete="username"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700 font-semibold mb-1 block">Şifre</span>
                        <input
                            type="password"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                            autoComplete="current-password"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-md text-white font-semibold transition
              ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-6 w-6 mx-auto text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        ) : (
                            'Giriş Yap'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
