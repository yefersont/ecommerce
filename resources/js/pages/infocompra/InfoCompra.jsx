import ReactDOMServer from "react-dom/server";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Package,
    ShoppingCart,
    CalendarDays,
    DollarSign,
    CreditCard,
    User,
} from "lucide-react";
import Loader from "../../components/Loader";
const InfoCompra = () => {
    const idUsuario = localStorage.getItem("idUsuarios");
    const { idOrden } = useParams();
    const [detalles, setDetalles] = useState("");
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        if (!idOrden || !idUsuario) return;

        axios
            .get(
                `http://127.0.0.1:8000/api/informacion-compra/${idUsuario}/${idOrden}`
            )
            .then((res) => {
                console.log(res.data);
                setDetalles(res.data);
                setLoading(false);
            })
            .catch((err) =>
                console.error("Error al obtener información de la compra:", err)
            );
    }, [idOrden, idUsuario]);

    const { datosenvio, ordendetalles, Fecha, Total, metodospago } = detalles;

    const handleDescargarFactura = () => {
        const html = ReactDOMServer.renderToString(
            <div>
                <style>
                    {`
                body {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    color: #000;
                }
                h1, h2 {
                    margin-bottom: 8px;
                    color: #000;
                }
                h1 {
                    font-size: 20px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 6px;
                }
                h2 {
                    font-size: 14px;
                    margin-top: 20px;
                    border-bottom: 1px solid #000;
                    padding-bottom: 4px;
                }
                section {
                    margin-bottom: 12px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 8px;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 6px;
                    text-align: left;
                }
                th {
                    background-color: #f5f5f5;
                }
                .total {
                    font-size: 14px;
                    font-weight: bold;
                    margin-top: 10px;
                    padding-top: 6px;
                    border-top: 2px solid #000;
                    text-align: right;
                }
            `}
                </style>

                <div
                    style={{
                        maxWidth: "800px",
                        margin: "0 auto",
                        padding: "20px",
                    }}
                >
                    <h1 style={{ textAlign: "center" }}>Factura de Compra</h1>

                    {/* Datos del comprador */}
                    <section>
                        <h2>Datos del Comprador</h2>
                        <p>
                            <strong>Nombre:</strong>{" "}
                            {datosenvio?.usuario?.Name || "N/A"}
                        </p>
                        <p>
                            <strong>Identificación:</strong>{" "}
                            {datosenvio?.Identificacion || "N/A"}
                        </p>
                        <p>
                            <strong>Correo:</strong>{" "}
                            {datosenvio?.usuario?.User || "N/A"}
                        </p>
                        <p>
                            <strong>Teléfono:</strong>{" "}
                            {datosenvio?.Telefono || "N/A"}
                        </p>
                    </section>

                    {/* Datos de envío */}
                    <section>
                        <h2>Datos de Envío</h2>
                        <p>
                            <strong>Dirección:</strong>{" "}
                            {datosenvio?.Direccion || "N/A"}
                        </p>
                        <p>
                            <strong>Dirección Alternativa:</strong>{" "}
                            {datosenvio?.DireccionAlternativa ||
                                "No registrada"}
                        </p>
                        <p>
                            <strong>Ciudad:</strong>{" "}
                            {datosenvio?.ciudade?.nombre || "N/A"}
                        </p>
                        <p>
                            <strong>Departamento:</strong>{" "}
                            {datosenvio?.departamento?.nombre || "N/A"}
                        </p>
                        <p>
                            <strong>Código Postal:</strong>{" "}
                            {datosenvio?.CodigoPostal || "N/A"}
                        </p>
                    </section>

                    {/* Método de pago */}
                    <section>
                        <h2>Método de Pago</h2>
                        <p>{metodospago?.Description || "Desconocido"}</p>
                    </section>

                    {/* Productos */}
                    <section>
                        <h2>Productos Comprados</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordendetalles.map((detalle, index) => (
                                    <tr key={index}>
                                        <td>{detalle.product?.Nombre}</td>
                                        <td>{detalle.Cantidad}</td>
                                        <td>
                                            ${detalle.PrecioUnitario.toFixed(2)}
                                        </td>
                                        <td>${detalle.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    {/* Fecha y total */}
                    <section>
                        <p>
                            <strong>Fecha de compra:</strong>{" "}
                            {new Date(Fecha).toLocaleDateString()}
                        </p>
                        <div className="total">
                            Total pagado: ${Total.toFixed(2)}
                        </div>
                    </section>
                </div>
            </div>
        );

        axios
            .post(
                "http://127.0.0.1:8000/api/generar-factura",
                { html },
                { responseType: "blob" }
            )
            .then((res) => {
                const file = new Blob([res.data], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, "_blank");
            })
            .catch((err) => console.error("Error al generar la factura:", err));
    };

    return (
        <div>
            {Loading ? (
                <Loader />
            ) : (
                <div className="max-w-5xl mx-auto p-6 mt-5 bg-white rounded-2xl shadow-lg space-y-8">
                    {/* Título principal */}
                    <h1 className="text-3xl font-bold text-gray-800 text-center">
                        Resumen de Compra
                    </h1>

                    {/* Datos del comprador */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <User className="text-yellow-600 w-5 h-5" />
                            <h2 className="text-xl font-semibold text-yellow-600">
                                Datos del Comprador
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                            <p>
                                <strong>Nombre:</strong>{" "}
                                {datosenvio?.usuario?.Name}
                            </p>
                            <p>
                                <strong>Correo:</strong>{" "}
                                {datosenvio?.usuario?.User}
                            </p>
                            <p>
                                <strong>Identificación:</strong>{" "}
                                {datosenvio?.Identificacion}
                            </p>
                        </div>
                    </section>

                    {/* Información de envío */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <Package className="text-yellow-600 w-5 h-5" />
                            <h2 className="text-xl font-semibold text-yellow-600">
                                Información de Envío
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                            <p>
                                <strong>Dirección:</strong>{" "}
                                {datosenvio?.Direccion}
                            </p>
                            <p>
                                <strong>Dirección Alternativa:</strong>{" "}
                                {datosenvio?.DireccionAlternativa ||
                                    "No registrada"}
                            </p>
                            <p>
                                <strong>Teléfono:</strong>{" "}
                                {datosenvio?.Telefono}
                            </p>
                            <p>
                                <strong>Ciudad:</strong>{" "}
                                {datosenvio?.ciudade?.nombre}
                            </p>
                            <p>
                                <strong>Departamento:</strong>{" "}
                                {datosenvio?.departamento?.nombre ||
                                    "No registrado"}
                            </p>
                            <p>
                                <strong>Código Postal:</strong>{" "}
                                {datosenvio?.CodigoPostal || "No registrado"}
                            </p>
                        </div>
                    </section>

                    {/* Método de pago */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <CreditCard className="text-yellow-600 w-5 h-5" />
                            <h2 className="text-xl font-semibold text-yellow-600">
                                Método de Pago
                            </h2>
                        </div>
                        <p className="text-gray-700 text-sm">
                            <strong>Método:</strong>{" "}
                            {metodospago?.Description || "Desconocido"}
                        </p>
                    </section>

                    {/* Productos comprados */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <ShoppingCart className="text-yellow-600 w-5 h-5" />
                            <h2 className="text-xl font-semibold text-yellow-600">
                                Productos Comprados
                            </h2>
                        </div>
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
                                                {detalle.PrecioUnitario.toFixed(
                                                    2
                                                )}
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                Subtotal: $
                                                {detalle.subtotal.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Fecha y total */}
                    <section className="flex flex-col md:flex-row justify-between items-center border-t pt-6 gap-4">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-blue-500" />
                            Fecha de compra:
                            <span className="font-medium ml-1">
                                {new Date(Fecha).toLocaleDateString()}
                            </span>
                        </p>
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Total pagado: ${Total.toFixed(2)}
                            </p>
                            <button
                                onClick={handleDescargarFactura}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-md shadow transition"
                            >
                                Descargar Factura
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default InfoCompra;
