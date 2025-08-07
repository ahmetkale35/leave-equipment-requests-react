import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SuccessAlert({ message, onClose }) {
    return (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-start shadow-md animate-fade-in">
            <CheckCircleIcon className="w-5 h-5 mr-2 mt-1" />
            <span className="block flex-1 text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="absolute top-0 right-0 mt-1 mr-2 text-green-500 hover:text-green-700 text-lg font-bold"
            >
                ×
            </button>
        </div>
    );
}
