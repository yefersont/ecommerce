import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

const Carrito = ({ onClose }) => {
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem("idUsuarios");

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://127.0.0.1:8000/api/carrito/${idUsuario}`)
            .then((res) => {
                setCarrito(res.data);
            })
            .catch((err) => {
                console.error("Error al cargar el carrito", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const vaciarCarrito = () => {
        Swal.fire({
            title: "¿Vaciar carrito?",
            text: "Se eliminarán todos los productos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Vaciar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(
                        `http://127.0.0.1:8000/api/carrito/${idUsuario}/vaciar`
                    )
                    .then(() => {
                        setCarrito([]);
                        Swal.fire("Carrito vaciado", "", "success");
                        onClose();
                    })
                    .catch(() =>
                        Swal.fire("Error al vaciar el carrito", "", "error")
                    );
            }
        });
    };

    const eliminarProductoCarrito = (item) => {
        const idProducto = item.product.idProductos;
        axios
            .delete(
                `http://127.0.0.1:8000/api/carrito/${idUsuario}/producto/${idProducto}`
            )
            .then(() =>
                setCarrito(
                    carrito.filter((p) => p.idCarrito !== item.idCarrito)
                )
            )
            .catch(() =>
                Swal.fire("Error al eliminar el producto", "", "error")
            );
    };

    const comprar = () => {
        navigate("/formulario-envio");
        onClose();
    };

    const totalGeneral = carrito.reduce((acc, item) => {
        return acc + parseFloat(item.product.Precio) * parseInt(item.Cantidad);
    }, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl relative flex flex-col overflow-hidden">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="p-5 border-b bg-gray-50 text-lg font-bold text-gray-800">
                    Tu carrito de compras
                </div>

                {/* Contenido */}
                <div className="px-5 py-3 flex-1 overflow-y-auto">
                    {loading ? (
                        <Loader />
                    ) : carrito.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">
                            Tu carrito está vacío.
                        </p>
                    ) : (
                        carrito.map((item, index) => {
                            const precio = parseFloat(item.product.Precio);
                            const cantidad = parseInt(item.Cantidad);
                            const total = precio * cantidad;

                            return (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 py-4 border-b group"
                                >
                                    <img
                                        src={`data:image/jpeg;base64,${item.product.Imagen}`}
                                        alt={item.product.Nombre}
                                        className="w-16 h-16 object-cover rounded border"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {item.product.Nombre}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Cantidad: {cantidad}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Precio: $
                                            {precio.toLocaleString("es-CO")}
                                        </p>
                                        <p className="text-sm font-semibold text-yellow-600 mt-1">
                                            Total: $
                                            {total.toLocaleString("es-CO")}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            eliminarProductoCarrito(item)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {carrito.length > 0 && (
                    <div className="p-5 border-t bg-gray-50">
                        <div className="flex justify-between mb-3 text-base font-semibold">
                            <span>Total:</span>
                            <span className="text-yellow-600">
                                ${totalGeneral.toLocaleString("es-CO")}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={vaciarCarrito}
                                className="w-1/2 py-2 rounded bg-[#3b4f68] text-yellow-400 hover:bg-[#232f3e] transition"
                            >
                                Vaciar
                            </button>
                            <button
                                onClick={comprar}
                                className="w-1/2 py-2 rounded bg-yellow-400 text-black hover:bg-yellow-500 transition"
                            >
                                ¡Comprar!
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Carrito;
