import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import { RadioGroup } from "@headlessui/react";

const CompraDetalle = () => {
    const [detalle, setDetalle] = useState([]);
    const [metodoPago, setMetodoPago] = useState("");
    const idUsuario = localStorage.getItem("idUsuarios");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://127.0.0.1:8000/api/carrito/${idUsuario}`)
            .then((res) => {
                setDetalle(res.data);
            })
            .catch((error) => {
                console.error("Error al mostrar los productos ", error);
            })
            .finally(() => {
                setLoading(false);
            });
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
    };

    const métodosPago = [
        { id: "efectivo", nombre: "Efectivo" },
        { id: "transferencia", nombre: "Transferencia bancaria" },
        { id: "tarjeta", nombre: "Tarjeta de crédito" },
    ];

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="relative min-h-screen bg-gray-100 py-6 max-w-6xl mx-auto flex px-0">
                    {/* Izquierda: productos con borde derecho */}
                    <div className="w-2/3 bg-gray-100 overflow-y-auto border-r border-gray-300 p-4">
                        <h2 className="text-2xl font-bold mb-6">
                            Detalles de la Compra
                        </h2>

                        {detalle.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 items-center mb-4 p-4 bg-gray-100 border-t border-gray-300"
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

                    {/* Derecha: métodos de pago fixed sin borde y mismo fondo */}
                    <div className="fixed top-1/2 right-[calc((100vw-1152px)/2)] w-[320px] bg-gray-100 p-6 -translate-y-1/2 flex flex-col justify-between">
                        <RadioGroup value={metodoPago} onChange={setMetodoPago}>
                            <RadioGroup.Label className="text-lg font-semibold mb-4">
                                Selecciona un método de pago
                            </RadioGroup.Label>
                            <div className="space-y-3">
                                {métodosPago.map((method) => (
                                    <RadioGroup.Option
                                        key={method.id}
                                        value={method.id}
                                        className={({ active, checked }) =>
                                            `block cursor-pointer rounded-lg px-4 py-2 border select-none
                      ${
                          checked
                              ? "bg-yellow-300 border-yellow-400 text-black font-semibold"
                              : "bg-white border-gray-300 text-gray-700"
                      }
                      ${active ? "ring-2 ring-yellow-400 ring-offset-2" : ""}`
                                        }
                                    >
                                        {method.nombre}
                                    </RadioGroup.Option>
                                ))}
                            </div>
                        </RadioGroup>

                        <div className="mt-6 text-xl font-semibold text-right">
                            Total a Pagar: ${total.toLocaleString()}
                        </div>

                        <button
                            onClick={confirmarCompra}
                            className="bg-yellow-300 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded shadow w-full mt-4"
                        >
                            Confirmar compra
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompraDetalle;
