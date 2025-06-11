import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import { RadioGroup } from "@headlessui/react";
import { useCompra } from "../../components/context/CompraContext";
import { useNavigate } from "react-router-dom";

const CompraDetalle = () => {
    const [detalle, setDetalle] = useState([]);
    const { metodoPagoContext, setMetodoPagoContext } = useCompra();
    const [metodoPago, setMetodoPago] = useState(metodoPagoContext || "");
    const [metodosPago, setMetodosPago] = useState([]);
    const idUsuario = localStorage.getItem("idUsuarios");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        const request1 = axios.get(
            `http://127.0.0.1:8000/api/carrito/${idUsuario}`
        );
        const request2 = axios.get(`http://127.0.0.1:8000/api/metodospago/`);

        Promise.all([request1, request2])
            .then(([res1, res2]) => {
                setDetalle(res1.data);
                console.log("Carrito (detalle):", res1.data);

                const pagosRaw = res2.data;
                const pagos =
                    Array.isArray(pagosRaw) && Array.isArray(pagosRaw[0])
                        ? pagosRaw[0]
                        : pagosRaw;

                console.log("Métodos de pago corregidos:", pagos);
                setMetodosPago(pagos);
            })
            .catch((error) => {
                console.error("Error en alguna llamada a API", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [idUsuario]);

    // ✅ Sincronizar si cambia el context (opcional, por robustez)
    useEffect(() => {
        if (metodoPagoContext) {
            setMetodoPago(metodoPagoContext);
        }
    }, [metodoPagoContext]);

    const total = detalle.reduce((acc, item) => {
        return acc + item.product.Precio * item.Cantidad;
    }, 0);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!metodoPago) {
            alert("Selecciona un método de pago");
            return;
        }
        setMetodoPagoContext(metodoPago);
        console.log(metodoPago);
        navigate("/seleccionar-tarjeta");
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-gray-100 py-6">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 px-4 lg:px-0 mt-[32px]">
                        {/* Productos */}
                        <div className="lg:w-2/3 w-full bg-transparent p-4 rounded shadow-none">
                            <h2 className="text-xl font-bold mb-4">
                                Detalles de la Compra
                            </h2>

                            <div className="max-h-[65vh] overflow-y-auto pr-2">
                                <ul className="divide-y divide-gray-200">
                                    {detalle.map((item) => (
                                        <li
                                            key={item.idCarrito}
                                            className="py-4 flex items-center gap-4"
                                        >
                                            <img
                                                src={`data:image/jpeg;base64,${item.product.Imagen}`}
                                                alt={item.product.Nombre}
                                                className="w-16 h-16 object-cover rounded shadow"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">
                                                    {item.product.Nombre}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.Cantidad} x $
                                                    {item.product.Precio.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right font-bold text-gray-700">
                                                $
                                                {(
                                                    item.product.Precio *
                                                    item.Cantidad
                                                ).toLocaleString()}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/* Línea divisoria */}
                        <div className="hidden lg:block w-px bg-gray-300 mx-2"></div>

                        {/* Panel derecho */}
                        <div className="lg:w-1/3 w-full bg-transparent p-6 rounded shadow-none flex flex-col items-center justify-center gap-6">
                            <RadioGroup
                                value={metodoPago}
                                onChange={setMetodoPago}
                                className="w-full"
                            >
                                <RadioGroup.Label className="text-lg font-semibold mb-4 text-center w-full">
                                    Selecciona un método de pago
                                </RadioGroup.Label>
                                <div className="space-y-3 w-full">
                                    {metodosPago.map((method) => (
                                        <RadioGroup.Option
                                            key={
                                                method.idMetodosPago ??
                                                method.Description
                                            }
                                            value={method.idMetodosPago}
                                            className={({ active, checked }) =>
                                                `block cursor-pointer rounded-lg px-4 py-2 border select-none text-center w-full ${
                                                    checked
                                                        ? "bg-yellow-300 border-yellow-400 text-black font-semibold"
                                                        : "bg-white border-gray-300 text-gray-700"
                                                } ${
                                                    active
                                                        ? "ring-2 ring-yellow-400 ring-offset-2"
                                                        : ""
                                                }`
                                            }
                                        >
                                            {method.Description}
                                        </RadioGroup.Option>
                                    ))}
                                </div>
                            </RadioGroup>

                            <div className="text-xl font-semibold text-center w-full">
                                Total a Pagar: ${total.toLocaleString()}
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <button
                                    onClick={onSubmit}
                                    className="bg-yellow-300 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded shadow w-full"
                                >
                                    Continuar →
                                </button>
                                <button
                                    className="w-full py-2 bg-[#232f3e] text-yellow-400 rounded hover:bg-[#3b4f68]"
                                    onClick={() => navigate("/productos")}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompraDetalle;
