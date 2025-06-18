import axios from "axios";
import { div } from "framer-motion/client";
import React, { useState, useEffect } from "react";

const Compras = () => {
    const idUsuario = localStorage.getItem("idUsuarios");
    const [ordenes, setOrdenes] = useState([]);

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/ordenes/usuario/${idUsuario}`)
            .then((res) => {
                setOrdenes(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error("Error: ", err);
            });
    }, [idUsuario]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-4xl font-semibold text-gray-800 mb-8 border-b pb-2">
                Historial de Compras
            </h1>

            {ordenes.length === 0 ? (
                <div className="flex flex-col justify-center items-center min-h-[60vh] text-gray-500">
                    <p className="text-2xl font-semibold">
                        Aún no has realizado ninguna compra
                    </p>
                    <p className="text-sm mt-2">
                        Cuando lo hagas, aparecerán aquí ✨
                    </p>
                </div>
            ) : (
                ordenes.map((orden) => (
                    <div
                        key={orden.idOrden}
                        className="mb-10 border rounded-2xl p-6 shadow-sm bg-white hover:bg-gray-200"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Orden #{orden.idOrden}
                            </h2>
                            <span className="text-gray-500">
                                {new Date(orden.Fecha).toLocaleString()}
                            </span>
                        </div>

                        <div className="space-y-4 ">
                            {orden.ordendetalles.map((detalle) => (
                                <div
                                    key={detalle.idOrdenDetalle}
                                    className="flex items-center gap-6 border-t pt-4 "
                                >
                                    {detalle.product?.Imagen && (
                                        <img
                                            src={`data:image/jpeg;base64,${detalle.product.Imagen}`}
                                            alt={detalle.product.Nombre}
                                            className="w-24 h-24 object-cover rounded-lg border"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium">
                                            {detalle.product.Nombre}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {detalle.product.Descripcion?.slice(
                                                0,
                                                100
                                            )}
                                            ...
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">
                                            ${detalle.PrecioUnitario.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Cantidad: {detalle.Cantidad}
                                        </p>
                                        <p className="text-sm text-gray-800">
                                            Subtotal: $
                                            {(
                                                detalle.PrecioUnitario *
                                                detalle.Cantidad
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-right mt-4 border-t pt-4">
                            <span
                                className="text-xl font-semibold text-gray-900
"
                            >
                                Total: ${orden.Total.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() =>
                                    console.log("Ver compra", orden.idOrden)
                                }
                                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md shadow transition"
                            >
                                Ver Compra
                            </button>
                            <button
                                onClick={() =>
                                    console.log(
                                        "Volver a comprar",
                                        orden.idOrden
                                    )
                                }
                                className="bg-[#3b4f68] text-yellow-400 hover:bg-[#232f3e]font-semibold px-4 py-2 rounded-md shadow transition"
                            >
                                Volver a Comprar
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Compras;
