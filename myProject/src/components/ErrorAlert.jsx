// components/ErrorAlert.jsx

import React from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function ErrorAlert({ message, onClose }) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-start shadow-md animate-fade-in">
            <XCircleIcon className="w-5 h-5 mr-2 mt-1" />
            <span className="block flex-1 text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="absolute top-0 right-0 mt-1 mr-2 text-red-500 hover:text-red-700 text-lg font-bold"
            >
                ×
            </button>
        </div>
    );
}
