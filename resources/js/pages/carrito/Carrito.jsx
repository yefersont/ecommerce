import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Carrito = ({ onClose }) => {
    const [carrito, setCarrito] = useState([]);
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem("idUsuarios");

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/carrito/${idUsuario}`)
            .then((res) => setCarrito(res.data))
            .catch((err) => console.error("Error al cargar el carrito", err));
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
        navigate("/compra-detalle");
        onClose();
    };

    const totalGeneral = carrito.reduce((acc, item) => {
        return acc + parseFloat(item.product.Precio) * parseInt(item.Cantidad);
    }, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-xl shadow-lg relative overflow-hidden flex flex-col">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="p-5 border-b text-lg font-semibold">
                    Tu carrito de compras
                </div>

                {/* Contenido */}
                <div className="px-5 py-3 flex-1 overflow-y-auto">
                    {carrito.length === 0 ? (
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
                                    className="flex items-start gap-4 py-4 border-b"
                                >
                                    <img
                                        src={`data:image/jpeg;base64,${item.product.Imagen}`}
                                        alt={item.product.Nombre}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {item.product.Nombre}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Cantidad: {cantidad}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Precio: $
                                            {precio.toLocaleString("es-CO")}
                                        </p>
                                        <p className="text-sm font-semibold mt-1">
                                            Total: $
                                            {total.toLocaleString("es-CO")}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            eliminarProductoCarrito(item)
                                        }
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Resumen y botones */}
                {carrito.length > 0 && (
                    <div className="p-5 border-t bg-gray-50">
                        <div className="flex justify-between mb-3 text-base font-medium">
                            <span>Total:</span>
                            <span>${totalGeneral.toLocaleString("es-CO")}</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={vaciarCarrito}
                                className="w-1/2 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Vaciar
                            </button>
                            <button
                                onClick={comprar}
                                className="w-1/2 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                            >
                                ¡Proceder con la compra!
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Carrito;
