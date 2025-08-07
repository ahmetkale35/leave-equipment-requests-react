import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDayOfWeek = (date) => {
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        return days[date.getDay()];
    };

    const getMonthName = (date) => {
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        return months[date.getMonth()];
    };

    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        for (let i = 0; i < 35; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const calendarDays = getCalendarDays();
    const today = new Date();

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 w-72 flex flex-col justify-between h-96">
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-indigo-50/50 rounded-2xl -z-10"></div>

            <div className="relative z-10 flex flex-col h-full">


                {/* Time Display - Daha kompakt */}
                <div className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-xl p-3 mb-4 border border-purple-200/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                                <FiClock size={14} />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-gray-800">{formatTime(currentDate)}</div>
                                <div className="text-xs text-gray-500 font-medium">{getDayOfWeek(currentDate)}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">{currentDate.getDate()}</div>
                            <div className="text-xs text-gray-500 font-medium">{getMonthName(currentDate)}</div>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid - Daha kompakt ve ortalı */}
                <div className="flex-grow flex flex-col justify-center">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'].map((day) => (
                            <div key={day} className="text-center text-xs font-bold text-purple-600 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => {
                            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                            const isToday = date.toDateString() === today.toDateString();
                            const isCurrentDate = date.getDate() === currentDate.getDate() && isCurrentMonth;

                            return (
                                <div
                                    key={index}
                                    className={`
                                        text-center text-xs py-1.5 rounded-lg transition-all duration-300 cursor-pointer
                                        ${isCurrentMonth ? 'text-gray-800 hover:bg-purple-100/50' : 'text-gray-400 hover:bg-gray-100/50'}
                                        ${isToday ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold shadow-lg scale-110' : ''}
                                        ${isCurrentDate && !isToday ? 'bg-gradient-to-br from-purple-200 to-pink-200 text-purple-800 font-semibold' : ''}
                                        hover:scale-105
                                    `}
                                >
                                    {date.getDate()}
                                </div>
                            );
                        })}
                    </div>
                </div>


            </div>
        </div>
    );
}