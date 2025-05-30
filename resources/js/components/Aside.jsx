// components/Aside.jsx
import React from "react";
import { X } from "lucide-react";
const Aside = ({ isOpen, onClose, children }) => {
    return (
        <aside
            className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transform transition-transform duration-300 z-40 ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Panel lateral</h2>
                <button onClick={onClose}>
                    <X />
                </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
                {children}
            </div>
        </aside>
    );
};

export default Aside;
