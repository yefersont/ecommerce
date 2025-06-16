import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import { RadioGroup } from "@headlessui/react";
import { useCompra } from "../../components/context/CompraContext";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import TarjetaForm from "./TarjetaForm";

const SeleccionarTarjeta = () => {
    const [tarjetas, setTarjetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false); // ✅ Estado del modal
    const { setTarjetaSeleccionadaContext, tarjetaSeleccionadaContext } =
        useCompra();
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem("idUsuarios");

    useEffect(() => {
        cargarTarjetas();
    }, [idUsuario, tarjetaSeleccionadaContext]);

    const cargarTarjetas = () => {
        setLoading(true);
        axios
            .get(`http://127.0.0.1:8000/api/tarjetas/${idUsuario}`)
            .then((res) => {
                setTarjetas(res.data);
                if (tarjetaSeleccionadaContext) {
                    setTarjetaSeleccionada(tarjetaSeleccionadaContext);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando tarjetas", err);
                setLoading(false);
            });
    };

    const handleSubmit = () => {
        if (!tarjetaSeleccionada) {
            alert("Selecciona una tarjeta para continuar.");
            return;
        }
        setTarjetaSeleccionadaContext(tarjetaSeleccionada);
        navigate("/resumen-pago");
    };
    console.log("modalAbierto:", modalAbierto);

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-gray-100 py-6">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 px-4 lg:px-0 mt-[32px]">
                        {/* Panel izquierdo */}
                        <div className="lg:w-2/3 w-full bg-transparent p-4 rounded shadow-none">
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
                                                `block cursor-pointer rounded-lg px-4 py-4 border select-none w-full text-center ${
                                                    checked
                                                        ? "bg-yellow-300 border-yellow-400 text-black font-semibold"
                                                        : "bg-white border-gray-300 text-gray-700"
                                                }`
                                            }
                                        >
                                            <div className="text-lg font-semibold">
                                                {tarjeta.Description}
                                            </div>
                                        </RadioGroup.Option>
                                    ))}
                                </div>
                            </RadioGroup>

                            <button
                                onClick={() => setModalAbierto(true)}
                                className="mt-6 text-sm text-blue-600 hover:underline"
                            >
                                + Agregar otra tarjeta
                            </button>
                        </div>

                        {/* Línea divisoria */}
                        <div className="hidden lg:block w-px bg-gray-300 mx-2"></div>

                        {/* Panel derecho */}
                        <div className="lg:w-1/3 w-full bg-transparent p-6 rounded shadow-none flex flex-col items-center justify-center gap-6">
                            <div className="text-lg font-semibold text-center w-full">
                                Tarjeta seleccionada:
                            </div>

                            <div className="text-gray-800 text-center w-full">
                                {tarjetaSeleccionada ? (
                                    tarjetas.find(
                                        (t) =>
                                            t.idTarjetas === tarjetaSeleccionada
                                    )?.Description
                                ) : (
                                    <span className="italic text-gray-500">
                                        Ninguna seleccionada
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 w-full">
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
                                    className="w-full py-2 bg-[#232f3e] text-yellow-400 rounded hover:bg-[#3b4f68]"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                title="Agregar tarjeta"
            >
                <TarjetaForm
                    onClose={() => setModalAbierto(false)}
                    onTarjetaCreada={cargarTarjetas}
                />{" "}
            </Modal>
        </div>
    );
};

export default SeleccionarTarjeta;
