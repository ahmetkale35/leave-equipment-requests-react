import React, { useState, useEffect } from 'react';

export default function SimpleWeather() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.4192&longitude=27.1287&current=temperature_2m,weather_code&timezone=Europe/Istanbul');
                const data = await response.json();

                if (response.ok) {
                    setWeather({
                        temp: data.current.temperature_2m,
                        code: data.current.weather_code
                    });
                }
            } catch (err) {
                console.error('Hava durumu hatası:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getWeatherIcon = (code) => {
        const icons = {
            0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
            45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '��️',
            55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '⛈️',
            71: '��️', 73: '❄️', 75: '❄️', 77: '❄️',
            80: '🌦️', 81: '��️', 82: '⛈️', 85: '��️',
            86: '❄️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
        };
        return icons[code] || '🌤️';
    };

    if (loading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="animate-pulse">
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full w-3/4 mb-3"></div>
                    <div className="h-8 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 rounded-2xl -z-10"></div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
                        <h3 className="text-sm font-semibold text-gray-700 tracking-wide">İZMİR</h3>
                    </div>
                    <div className="text-4xl transform hover:scale-110 transition-transform duration-300">
                        {getWeatherIcon(weather.code)}
                    </div>
                </div>

                {/* Temperature */}
                <div className="text-center mb-3">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        {Math.round(weather.temp)}°
                    </div>
                    <div className="text-xs text-gray-500 font-medium tracking-wide">
                        CELSIUS
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="flex justify-center space-x-1 mb-3">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                </div>

                {/* Status Bar */}
                <div className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-full p-1">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 rounded-full w-3/4"></div>
                </div>
            </div>
        </div>
    );
}