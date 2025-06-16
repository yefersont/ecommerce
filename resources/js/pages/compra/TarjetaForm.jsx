import React, { useState } from "react";
import axios from "axios";

const TarjetaForm = ({ onClose, onTarjetaCreada }) => {
    const [descripcion, setDescripcion] = useState("");
    const [saldo, setSaldo] = useState("");
    const idUsuario = localStorage.getItem("idUsuarios");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!descripcion || !saldo) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const nuevaTarjeta = {
            Description: descripcion,
            Saldo: saldo,
            Usuarios_idUsuarios: idUsuario,
        };

        axios
            .post("http://127.0.0.1:8000/api/tarjetas", nuevaTarjeta)
            .then(() => {
                alert("Tarjeta agregada con éxito");
                onTarjetaCreada?.();
                onClose();
            })
            .catch((err) => {
                console.error("Error al agregar tarjeta:", err);
                alert("Error al agregar la tarjeta");
            });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 p-4 bg-transparent rounded-lg"
        >
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">
                    Descripción
                </label>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ej: Tarjeta débito Bancolombia"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-800">
                    Saldo
                </label>
                <input
                    type="number"
                    value={saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                    placeholder="Ej: 250000"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-all"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded transition-all"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default TarjetaForm;
