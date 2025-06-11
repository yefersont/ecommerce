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

    // Para filtrar en tiempo real los caracteres inválidos en nombre
    const handleNombreInput = (e) => {
        const filtered = e.target.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "");
        setValue("nombreCompleto", filtered);
    };

    // Para filtrar solo números en identificación
    const handleIdentificacionInput = (e) => {
        const filtered = e.target.value.replace(/\D/g, "");
        setValue("identificacion", filtered);
    };

    // Para filtrar solo números en teléfono
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
                    className="w-full max-w-6xl mx-auto bg-white p-6 shadow-md rounded-md"
                >
                    <h2 className="text-2xl font-bold mb-6">
                        Información de Envío
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">
                                Datos del remitente
                            </h3>

                            <div className="space-y-3">
                                {/* Nombre */}
                                <div>
                                    <label className="block font-medium mb-1 text-sm">
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
                                        placeholder="Nombre completo"
                                        className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                        onInput={handleNombreInput}
                                    />
                                    {errors.nombreCompleto && (
                                        <p className="text-red-500 text-xs mt-0.5">
                                            {errors.nombreCompleto.message}
                                        </p>
                                    )}
                                </div>

                                {/* Identificación */}
                                <div>
                                    <label className="block font-medium mb-1 text-sm">
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
                                        className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                        onInput={handleIdentificacionInput}
                                    />
                                    {errors.identificacion && (
                                        <p className="text-red-500 text-xs mt-0.5">
                                            {errors.identificacion.message}
                                        </p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="block font-medium mb-1 text-sm">
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
                                        className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                        onInput={handleTelefonoInput}
                                    />
                                    {errors.telefono && (
                                        <p className="text-red-500 text-xs mt-0.5">
                                            {errors.telefono.message}
                                        </p>
                                    )}
                                </div>

                                {/* Correo */}
                                <div>
                                    <label className="block font-medium mb-1 text-sm">
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
                                        placeholder="Correo electrónico"
                                        className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                    />
                                    {errors.correo && (
                                        <p className="text-red-500 text-xs mt-0.5">
                                            {errors.correo.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dirección de envío */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">
                                Dirección de envío
                            </h3>

                            <div className="space-y-3">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block font-medium mb-1 text-sm text-gray-700">
                                            Departamento
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register("departamento", {
                                                    required:
                                                        "Este campo es obligatorio",
                                                })}
                                                className="w-full appearance-none border border-gray-300 bg-white px-4 py-2 pr-10 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                            >
                                                <option value="">
                                                    Selecciona un departamento
                                                </option>
                                                {departamentos.map((dep) => (
                                                    <option
                                                        key={
                                                            dep.idDepartamentos
                                                        }
                                                        value={
                                                            dep.idDepartamentos
                                                        }
                                                    >
                                                        {dep.nombre}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Ícono de flecha hacia abajo */}
                                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        {errors.departamento && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.departamento.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <label className="block font-medium mb-1 text-sm text-gray-700">
                                            Ciudad
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register("ciudad", {
                                                    required:
                                                        "Este campo es obligatorio",
                                                })}
                                                disabled={ciudades.length === 0}
                                                className="w-full appearance-none border border-gray-300 bg-white px-4 py-2 pr-10 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                            >
                                                <option value="">
                                                    {ciudades.length === 0
                                                        ? "Primero selecciona un departamento"
                                                        : "Selecciona una ciudad"}
                                                </option>
                                                {ciudades.map((ciudad) => (
                                                    <option
                                                        key={ciudad.idCiudades}
                                                        value={
                                                            ciudad.idCiudades
                                                        }
                                                    >
                                                        {ciudad.nombre}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.ciudad && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.ciudad.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium mb-1 text-sm">
                                        Dirección principal
                                    </label>
                                    <input
                                        {...register("direccionPrincipal", {
                                            required:
                                                "Este campo es obligatorio",
                                        })}
                                        placeholder="Dirección completa"
                                        className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                    />
                                    {errors.direccionPrincipal && (
                                        <p className="text-red-500 text-xs mt-0.5">
                                            {errors.direccionPrincipal.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-medium mb-1 text-sm">
                                        Dirección alternativa (opcional)
                                    </label>
                                    <input
                                        {...register("direccionAlternativa")}
                                        placeholder="Apto, piso u otra referencia"
                                        className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1 text-sm">
                                        Código Postal (opcional)
                                    </label>
                                    <input
                                        {...register("codigoPostal")}
                                        placeholder="Código postal"
                                        className="w-full border p-2 rounded text-sm  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1 text-sm">
                                        Instrucciones adicionales (opcional)
                                    </label>
                                    <textarea
                                        {...register("instrucciones")}
                                        placeholder="Ej. no timbrar, dejar en portería"
                                        rows={3}
                                        className="w-full border p-2 rounded resize-none text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            className="px-20 py-2 bg-[#232f3e] text-yellow-400 rounded hover:bg-[#3b4f68]"
                            onClick={() => {
                                navigate("/productos");
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-20 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
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
