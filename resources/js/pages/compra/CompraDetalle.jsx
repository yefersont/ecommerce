import React, { useState, useEffect } from "react";
import axios from "axios";

const CompraDetalle = () => {
    const [detalle, setDetalle] = useState([]);
    const [metodoPago, setMetodoPago] = useState("");
    const idUsuario = localStorage.getItem("idUsuarios");

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/carrito/${idUsuario}`)
            .then((res) => {
                setDetalle(res.data);
            })
            .catch((error) =>
                console.error("Error al mostrar los productos ", error)
            );
    }, []);

    const total = detalle.reduce((acc, item) => {
        return acc + item.product.Precio * item.Cantidad;
    }, 0);

    const confirmarCompra = () => {
        if (!metodoPago) {
            alert("Selecciona un método de pago");
            return;
        }
        alert(`Compra confirmada con método de pago: ${metodoPago}`);
        // Aquí podrías enviar los datos al backend
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Detalles de la Compra</h2>

            <div className="space-y-4">
                {detalle.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4 items-center border-b pb-2"
                    >
                        <img
                            src={`data:image/jpeg;base64,${item.product.Imagen}`}
                            alt={item.product.Nombre}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                            <p className="font-semibold">
                                {item.product.Nombre}
                            </p>
                            <p className="text-sm text-gray-500">
                                Precio: ${item.product.Precio}
                            </p>
                            <p className="text-sm text-gray-500">
                                Cantidad: {item.Cantidad}
                            </p>
                            <p className="text-sm text-gray-500">
                                Subtotal: ${item.product.Precio} x{" "}
                                {item.Cantidad} = $
                                {(
                                    item.product.Precio * item.Cantidad
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-right text-xl font-semibold">
                Total a Pagar: ${total.toLocaleString()}
            </div>

            <div className="mt-6">
                <h3 className="font-semibold mb-2">Método de Pago</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="efectivo"
                            checked={metodoPago === "efectivo"}
                            onChange={(e) => setMetodoPago(e.target.value)}
                        />
                        Efectivo
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="transferencia"
                            checked={metodoPago === "transferencia"}
                            onChange={(e) => setMetodoPago(e.target.value)}
                        />
                        Transferencia bancaria
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="tarjeta"
                            checked={metodoPago === "tarjeta"}
                            onChange={(e) => setMetodoPago(e.target.value)}
                        />
                        Tarjeta de crédito
                    </label>
                </div>
            </div>

            <button
                onClick={confirmarCompra}
                className="mt-6 bg-yellow-300 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded shadow"
            >
                Confirmar compra
            </button>
        </div>
    );
};

export default CompraDetalle;
