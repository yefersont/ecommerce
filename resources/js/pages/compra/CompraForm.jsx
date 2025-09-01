import react, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Loader from "../../components/Loader";
import axios from "axios";
import { useCompra } from "../../components/context/CompraContext";
import { useNavigate } from "react-router-dom";

const CompraEnvio = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [departamentos, setDepartamentos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm();
    const departamentoSeleccionado = watch("departamento");
    const { datosEnvio, setDatosEnvio } = useCompra();

    const handleNombreInput = (e) => {
        const filtered = e.target.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "");
        setValue("nombreCompleto", filtered);
    };

    const handleIdentificacionInput = (e) => {
        const filtered = e.target.value.replace(/\D/g, "");
        setValue("identificacion", filtered);
    };

    const handleTelefonoInput = (e) => {
        const filtered = e.target.value.replace(/\D/g, "");
        setValue("telefono", filtered);
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://127.0.0.1:8000/api/departamentos`)
            .then((res) => {
                setDepartamentos(res.data);
            })
            .catch((err) => {
                console.error("Erroa la cargar los departamentos", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (departamentoSeleccionado) {
            axios
                .get(
                    `http://127.0.0.1:8000/api/departamentos/${departamentoSeleccionado}/ciudades`
                )
                .then((res) => {
                    setCiudades(res.data);
                    setValue("ciudad", ""); // Limpiar ciudad seleccionada anterior
                })
                .catch((err) => {
                    console.error("Error al cargar las ciudades", err);
                    setCiudades([]);
                });
        } else {
            setCiudades([]);
        }
    }, [departamentoSeleccionado]);

    useEffect(() => {
        if (datosEnvio) {
            Object.entries(datosEnvio).forEach(([key, value]) => {
                setValue(key, value);
            });
        }
    }, []);

    const onSubmit = (data) => {
        setDatosEnvio(data);
        console.log("Datos guardados: ", data);
        navigate("/compra-detalle");
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-4xl mx-auto mt-6 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-md border border-gray-100"
                >
                    {/* Encabezado */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center tracking-tight">
                        Información de Envío
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Datos remitente */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
                                Datos del remitente
                            </h3>

                            <div className="space-y-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block font-medium mb-1 text-sm text-gray-700">
                                        Nombre completo
                                    </label>
                                    <input
                                        {...register("nombreCompleto", {
                                            required:
                                                "Este campo es obligatorio",
                                            pattern: {
                                                value: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/,
                                                message:
                                                    "Solo se permiten letras",
                                            },
                                        })}
                                        placeholder="Ej: Juan Pérez"
                                        className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                        onInput={handleNombreInput}
                                    />
                                    {errors.nombreCompleto && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.nombreCompleto.message}
                                        </p>
                                    )}
                                </div>

                                {/* Identificación */}
                                <div>
                                    <label className="block font-medium mb-1 text-sm text-gray-700">
                                        Identificación
                                    </label>
                                    <input
                                        {...register("identificacion", {
                                            required:
                                                "Este campo es obligatorio",
                                            pattern: {
                                                value: /^\d+$/,
                                                message:
                                                    "Solo se permiten números",
                                            },
                                        })}
                                        placeholder="Cédula o NIT"
                                        className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                        onInput={handleIdentificacionInput}
                                    />
                                    {errors.identificacion && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.identificacion.message}
                                        </p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="block font-medium mb-1 text-sm text-gray-700">
                                        Teléfono
                                    </label>
                                    <input
                                        {...register("telefono", {
                                            required:
                                                "Este campo es obligatorio",
                                            pattern: {
                                                value: /^\d+$/,
                                                message:
                                                    "Solo se permiten números",
                                            },
                                        })}
                                        placeholder="Número de teléfono"
                                        className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                        onInput={handleTelefonoInput}
                                    />
                                    {errors.telefono && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.telefono.message}
                                        </p>
                                    )}
                                </div>

                                {/* Correo */}
                                <div>
                                    <label className="block font-medium mb-1 text-sm text-gray-700">
                                        Correo electrónico
                                    </label>
                                    <input
                                        {...register("correo", {
                                            required:
                                                "Este campo es obligatorio",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message:
                                                    "Correo electrónico inválido",
                                            },
                                        })}
                                        placeholder="correo@ejemplo.com"
                                        className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                    />
                                    {errors.correo && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.correo.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dirección envío */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
                                Dirección de envío
                            </h3>

                            <div className="space-y-4">
                                {/* Departamento y Ciudad */}
                                <div className="flex gap-4">
                                    {/* Departamento */}
                                    <div className="flex-1">
                                        <label className="block font-medium mb-1 text-sm text-gray-700">
                                            Departamento
                                        </label>
                                        <select
                                            {...register("departamento", {
                                                required:
                                                    "Este campo es obligatorio",
                                            })}
                                            className="w-full px-3 py-2.5 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                        >
                                            <option value="">
                                                Selecciona un departamento
                                            </option>
                                            {departamentos.map((dep) => (
                                                <option
                                                    key={dep.idDepartamentos}
                                                    value={dep.idDepartamentos}
                                                >
                                                    {dep.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.departamento && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.departamento.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Ciudad */}
                                    <div className="flex-1">
                                        <label className="block font-medium mb-1 text-sm text-gray-700">
                                            Ciudad
                                        </label>
                                        <select
                                            {...register("ciudad", {
                                                required:
                                                    "Este campo es obligatorio",
                                            })}
                                            disabled={ciudades.length === 0}
                                            className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                                                ciudades.length === 0
                                                    ? "border-gray-200 bg-gray-100 text-gray-400"
                                                    : "border-gray-300 bg-white"
                                            }`}
                                        >
                                            <option value="">
                                                {ciudades.length === 0
                                                    ? "Primero selecciona un departamento"
                                                    : "Selecciona una ciudad"}
                                            </option>
                                            {ciudades.map((ciudad) => (
                                                <option
                                                    key={ciudad.idCiudades}
                                                    value={ciudad.idCiudades}
                                                >
                                                    {ciudad.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ciudad && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.ciudad.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Dirección principal */}
                                <div>
                                    <label className="block font-medium mb-1 text-sm text-gray-700">
                                        Dirección principal
                                    </label>
                                    <input
                                        {...register("direccionPrincipal", {
                                            required:
                                                "Este campo es obligatorio",
                                        })}
                                        placeholder="Calle 123 #45-67"
                                        className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                    />
                                    {errors.direccionPrincipal && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.direccionPrincipal.message}
                                        </p>
                                    )}
                                </div>

                                {/* Opcionales */}
                                <input
                                    {...register("direccionAlternativa")}
                                    placeholder="Apto, piso u otra referencia (opcional)"
                                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                />

                                <input
                                    {...register("codigoPostal")}
                                    placeholder="Código Postal (opcional)"
                                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                />

                                <textarea
                                    {...register("instrucciones")}
                                    placeholder="Ej. no timbrar, dejar en portería (opcional)"
                                    rows={3}
                                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            onClick={() => navigate("/productos")}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 hover:scale-105 transition transform"
                        >
                            Continuar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CompraEnvio;
