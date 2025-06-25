import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const InfoCompra = () => {
    const idUsuario = localStorage.getItem("idUsuarios");
    const { idOrden } = useParams();
    const [detalles, setDetalles] = useState(null);

    useEffect(() => {
        if (!idOrden || !idUsuario) return;

        axios
            .get(
                `http://127.0.0.1:8000/api/informacion-compra/${idUsuario}/${idOrden}`
            )
            .then((res) => setDetalles(res.data))
            .catch((err) =>
                console.error("Error al obtener información de la compra:", err)
            );
    }, [idOrden, idUsuario]);

    if (!detalles)
        return (
            <p className="text-center py-10 text-gray-500">
                Cargando información de la compra...
            </p>
        );

    const { datosenvio, ordendetalles, Fecha, Total } = detalles;

    return (
        <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
                Resumen de Compra
            </h1>

            {/* Información de envío */}
            <section>
                <h2 className="text-xl font-semibold text-yellow-600 mb-4 border-b pb-2">
                    📦 Información de Envío
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                    <p>
                        <strong>Dirección:</strong> {datosenvio?.Direccion}
                    </p>
                    <p>
                        <strong>Dirección Alternativa:</strong>{" "}
                        {datosenvio?.DireccionAlternativa || "No registrada"}
                    </p>
                    <p>
                        <strong>Teléfono:</strong> {datosenvio?.Telefono}
                    </p>
                    <p>
                        <strong>Correo:</strong> {datosenvio?.Correo}
                    </p>
                    <p>
                        <strong>Identificación:</strong>{" "}
                        {datosenvio?.Identificacion}
                    </p>
                </div>
            </section>

            {/* Productos comprados */}
            <section>
                <h2 className="text-xl font-semibold text-yellow-600 mb-4 border-b pb-2">
                    🛒 Productos Comprados
                </h2>
                <div className="space-y-4">
                    {ordendetalles.map((detalle, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                        >
                            <img
                                src={`data:image/jpeg;base64,${detalle.product?.Imagen}`}
                                alt={detalle.product?.Nombre}
                                className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    {detalle.product?.Nombre}
                                </h3>
                                <div className="text-sm text-gray-600">
                                    <p>Cantidad: {detalle.Cantidad}</p>
                                    <p>
                                        Precio Unitario: $
                                        {detalle.PrecioUnitario.toFixed(2)}
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        Subtotal: ${detalle.subtotal.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Total y Fecha */}
            <section className="flex flex-col md:flex-row justify-between items-center border-t pt-6">
                <p className="text-sm text-gray-600 mb-2 md:mb-0">
                    📅 Fecha de compra:{" "}
                    <span className="font-medium">
                        {new Date(Fecha).toLocaleDateString()}
                    </span>
                </p>
                <p className="text-2xl font-bold text-green-600">
                    Total pagado: ${Total.toFixed(2)}
                </p>
            </section>
        </div>
    );
};

export default InfoCompra;
