import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut
} from "lucide-react";
import Modal from "../components/Modal";
import Carrito from "../pages/carrito/Carrito";

const MainLayout = ({ children }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const role = localStorage.getItem("role");

  const hanleOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("User");
    alert("Cerrando sesión...");
    window.location.href = "/login";
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Navbar estilo Amazon */}
      <header className="bg-[#232f3e] text-white flex items-center justify-between p-3 shadow-md fixed top-0 left-0 right-0 z-50">
        <span  className="text-xl font-bold px-4">E-e<span className="text-yellow-500">commerce</span></span>

        {/* Opciones de usuario */}
        <nav className="flex gap-6 items-center px-4">

          
          <div className="text-sm text-right">
            <span className="block">Hola, {userData?.Name || "Invitado"}</span>
            <button onClick={hanleOut} className="text-xs text-yellow-400 hover:underline">Cerrar sesión</button>
          </div>


          <Link to="/productos" className="text-sm hover:underline" >Productos</Link>

          <Link to="" className="text-sm hover:underline" >Mis compras</Link>

          {role === "1" && (
            <Link to="/usuarios" className="text-sm hover:underline">Usuarios</Link>
          )}
          
          <button
            onClick={() => setModalAbierto(true)}
            className="relative flex items-center hover:scale-105 transition"
          >
            <ShoppingCart />
            <span className="text-xs ml-1">Carrito</span>
          </button>
        </nav>
      </header>

      {/* Espacio para compensar la navbar fija */}
      <div className="h-16"></div>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto p-4">{children}</main>

      {/* Modal del carrito */}
      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Carrito de Productos"
      >
        <Carrito onClose={() => setModalAbierto(false)} />
      </Modal>
    </div>
  );
};

export default MainLayout;
