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

    return loading ? (
        <Loader />
    ) : (
        <div className="py-12">
            {" "}
            {/* Aumenté el padding superior */}
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 px-4">
                {/* Productos */}
                <div className="lg:w-2/3 w-full bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        Detalles de la Compra
                    </h2>

                    <div className="max-h-[65vh] overflow-y-auto pr-2">
                        <ul className="divide-y divide-gray-200">
                            {detalle.map((item) => (
                                <li
                                    key={item.idCarrito}
                                    className="py-4 flex items-center gap-4 hover:bg-gray-50 rounded-md transition"
                                >
                                    <img
                                        src={`data:image/jpeg;base64,${item.product.Imagen}`}
                                        alt={item.product.Nombre}
                                        className="w-16 h-16 object-cover rounded border border-gray-200"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">
                                            {item.product.Nombre}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {item.Cantidad} × $
                                            {item.product.Precio.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right font-semibold text-gray-900">
                                        $
                                        {(
                                            item.product.Precio * item.Cantidad
                                        ).toLocaleString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Línea divisoria */}
                <div className="hidden lg:block w-px bg-gray-200"></div>

                {/* Panel derecho */}
                <div className="lg:w-1/3 w-full bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-6">
                    <RadioGroup
                        value={metodoPago}
                        onChange={setMetodoPago}
                        className="w-full"
                    >
                        <RadioGroup.Label className="text-lg font-medium mb-4 text-gray-800">
                            Selecciona un método de pago
                        </RadioGroup.Label>
                        <div className="space-y-3">
                            {metodosPago.map((method) => (
                                <RadioGroup.Option
                                    key={
                                        method.idMetodosPago ??
                                        method.Description
                                    }
                                    value={method.idMetodosPago}
                                    className={({ active, checked }) =>
                                        `block cursor-pointer rounded-md px-4 py-3 border text-center text-sm font-medium transition ${
                                            checked
                                                ? "bg-yellow-300 border-yellow-400 text-black"
                                                : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
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

                    <div className="text-lg font-semibold text-gray-900 text-center">
                        Total a Pagar: ${total.toLocaleString()}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onSubmit}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md shadow-sm transition"
                        >
                            Continuar →
                        </button>
                        <button
                            className="py-3 bg-[#232f3e] text-yellow-400 rounded-md hover:bg-[#3b4f68] transition"
                            onClick={() => navigate("/productos")}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompraDetalle;
