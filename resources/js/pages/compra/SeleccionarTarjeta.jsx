import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import { RadioGroup } from "@headlessui/react";
import { useCompra } from "../../components/context/CompraContext";
import { useNavigate } from "react-router-dom";

const SeleccionarTarjeta = () => {
    const [tarjetas, setTarjetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState("");
    const { setTarjetaSeleccionadaContext, tarjetaSeleccionadaContext } =
        useCompra(); // ⬅️ usamos también el valor actual del contexto
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem("idUsuarios");

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/tarjetas/${idUsuario}`)
            .then((res) => {
                setTarjetas(res.data);
                // Recuperamos la tarjeta seleccionada del contexto, si existe
                if (tarjetaSeleccionadaContext) {
                    setTarjetaSeleccionada(tarjetaSeleccionadaContext);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando tarjetas", err);
                setLoading(false);
            });
    }, [idUsuario, tarjetaSeleccionadaContext]);

    const handleSubmit = () => {
        if (!tarjetaSeleccionada) {
            alert("Selecciona una tarjeta para continuar.");
            return;
        }
        setTarjetaSeleccionadaContext(tarjetaSeleccionada);
        navigate("/resumen-pago");
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="relative min-h-screen bg-gray-100 py-6 max-w-6xl mx-auto flex px-0">
                    {/* Izquierda: tarjetas */}
                    <div className="w-2/3 bg-gray-100 border-r border-gray-300 p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            Selecciona una tarjeta
                        </h2>

                        <RadioGroup
                            value={tarjetaSeleccionada}
                            onChange={setTarjetaSeleccionada}
                        >
                            <div className="space-y-4">
                                {tarjetas.map((tarjeta) => (
                                    <RadioGroup.Option
                                        key={tarjeta.idTarjetas}
                                        value={tarjeta.idTarjetas}
                                        className={({ checked }) =>
                                            `block cursor-pointer rounded-lg px-4 py-4 border
                                                ${
                                                    checked
                                                        ? "bg-yellow-300 border-yellow-400 text-black font-semibold"
                                                        : "bg-white border-gray-300 text-gray-700"
                                                }`
                                        }
                                    >
                                        <div>
                                            <p className="text-lg font-semibold">
                                                {tarjeta.Description}
                                            </p>
                                        </div>
                                    </RadioGroup.Option>
                                ))}
                            </div>
                        </RadioGroup>

                        {/* Botón para agregar otra tarjeta */}
                        <button
                            type="button"
                            onClick={() => navigate("/agregar-tarjeta")}
                            className="mt-6 text-sm text-blue-600 hover:underline"
                        >
                            + Agregar otra tarjeta
                        </button>
                    </div>

                    {/* Derecha: botón continuar */}
                    <div className="fixed top-1/2 right-[calc((100vw-1152px)/2)] w-[320px] bg-gray-100 p-6 -translate-y-1/2 flex flex-col justify-between rounded-lg shadow">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Tarjeta seleccionada:
                            </h3>
                            {tarjetaSeleccionada ? (
                                <p className="text-gray-800">
                                    {
                                        tarjetas.find(
                                            (t) =>
                                                t.idTarjetas ===
                                                tarjetaSeleccionada
                                        )?.Description
                                    }
                                </p>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Ninguna seleccionada
                                </p>
                            )}
                        </div>

                        <div className="mt-6 space-y-3">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-yellow-300 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded shadow w-full"
                            >
                                Continuar
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/compra-detalle")}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow w-full"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeleccionarTarjeta;
