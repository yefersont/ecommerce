// src/components/Modal.jsx
import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-center text-gray-800">{title}</h2> {/* Aquí mostramos el título */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
