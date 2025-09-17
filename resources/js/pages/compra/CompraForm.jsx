import react, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Loader from "../../components/Loader";
import axios from "axios";
import { useCompra } from "../../components/context/CompraContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CompraEnvio = () => {
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem("idUsuarios");
    const [Datos, setDatos] = useState("");
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
    const [mostrarForm, setMostrarForm] = useState(false);

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

    const DatosenvioByUser = () => {
        axios
            .get(`http://127.0.0.1:8000/api/datosenvio-usuario/${idUsuario}`)
            .then((res) => {
                setDatos(res.data);
                console.log("Los datos de envio del usuario son", res.data);
            })
            .catch((err) => {
                console.error("error al obtener los datos");
            });
    };

    useEffect(() => {
        DatosenvioByUser();
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
                    setValue("ciudad", "");
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

    const onSubmitDireccionExistente = (data) => {
        const seleccionada = Datos.find(
            (d) => String(d.idDatosEnvio) === data.direccion
        );

        if (seleccionada) {
            const direccionNormalizada = {
                direccionPrincipal: seleccionada.Direccion || "",
                direccionAlternativa: seleccionada.DireccionAlternativa || "",
                instrucciones: seleccionada.Observaciones || "",
                identificacion: seleccionada.Identificacion || "",
                telefono: seleccionada.Telefono || "",
                correo: seleccionada.Correo || "",
                ciudad: seleccionada.Ciudades_idCiudades || "",
                departamento: seleccionada.Departamentos_idDepartamentos || "",
                codigoPostal: seleccionada.CodigoPostal || "",
            };

            setDatosEnvio(direccionNormalizada);
            console.log(
                "Dirección seleccionada (normalizada):",
                direccionNormalizada
            );
            navigate("/compra-detalle");
        }
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {Datos.length > 0 && !mostrarForm ? (
                        <motion.form
                            onSubmit={handleSubmit(onSubmitDireccionExistente)}
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full max-w-4xl mx-auto mt-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow border border-gray-100"
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Selecciona tu dirección de envío
                            </h2>

                            <div className="space-y-3">
                                {Datos.map((d) => (
                                    <label
                                        key={d.idDatosEnvio}
                                        className={`relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                                            watch("direccion") ===
                                            String(d.idDatosEnvio)
                                                ? "border-yellow-400 bg-yellow-100 ring-2 ring-yellow-300"
                                                : "border-gray-300 bg-white hover:bg-yellow-50"
                                        }`}
                                    >
                                        {/* Input conectado a react-hook-form */}
                                        <input
                                            type="radio"
                                            value={d.idDatosEnvio}
                                            {...register("direccion", {
                                                required: true,
                                            })}
                                            className="hidden"
                                        />

                                        {/* Icono de selección */}
                                        <div
                                            className={`w-5 h-5 mt-1 rounded-full border flex items-center justify-center transition ${
                                                watch("direccion") ===
                                                String(d.idDatosEnvio)
                                                    ? "border-yellow-500 bg-yellow-400"
                                                    : "border-gray-400 bg-white"
                                            }`}
                                        >
                                            {watch("direccion") ===
                                                String(d.idDatosEnvio) && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                            )}
                                        </div>

                                        {/* Info de dirección resumida */}
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {d.Direccion}
                                            </p>
                                            {d.DireccionAlternativa && (
                                                <p className="text-sm text-gray-600">
                                                    {d.DireccionAlternativa}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                Tel: {d.Telefono}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {d.Correo}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Link para agregar nueva dirección */}
                            <button
                                type="button"
                                onClick={() => {
                                    setDatosEnvio(null);
                                    setMostrarForm(true);
                                }}
                                className="mt-4 text-sm font-medium text-yellow-600 hover:underline"
                            >
                                + Nueva dirección
                            </button>

                            {/* Botón de continuar */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 hover:scale-105 transition transform"
                                >
                                    Continuar
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form
                            onSubmit={handleSubmit(onSubmit)}
                            initial={{ x: "100%", opacity: 0 }} // empieza fuera a la derecha
                            animate={{ x: 0, opacity: 1 }} // entra a su lugar
                            exit={{ x: "100%", opacity: 0 }} // sale hacia la derecha
                            transition={{ duration: 0.5, ease: "easeOut" }}
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
                                                onInput={
                                                    handleIdentificacionInput
                                                }
                                            />
                                            {errors.identificacion && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {
                                                        errors.identificacion
                                                            .message
                                                    }
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
                                                    {...register(
                                                        "departamento",
                                                        {
                                                            required:
                                                                "Este campo es obligatorio",
                                                        }
                                                    )}
                                                    className="w-full px-3 py-2.5 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                                >
                                                    <option value="">
                                                        Selecciona un
                                                        departamento
                                                    </option>
                                                    {departamentos.map(
                                                        (dep) => (
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
                                                        )
                                                    )}
                                                </select>
                                                {errors.departamento && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {
                                                            errors.departamento
                                                                .message
                                                        }
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
                                                    disabled={
                                                        ciudades.length === 0
                                                    }
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
                                                            key={
                                                                ciudad.idCiudades
                                                            }
                                                            value={
                                                                ciudad.idCiudades
                                                            }
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
                                                {...register(
                                                    "direccionPrincipal",
                                                    {
                                                        required:
                                                            "Este campo es obligatorio",
                                                    }
                                                )}
                                                placeholder="Calle 123 #45-67"
                                                className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                            />
                                            {errors.direccionPrincipal && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {
                                                        errors
                                                            .direccionPrincipal
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Opcionales */}
                                        <input
                                            {...register(
                                                "direccionAlternativa"
                                            )}
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
                            <div className="mt-8 flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setMostrarForm(false)}
                                    className="text-sm font-medium text-gray-500 hover:underline"
                                >
                                    ← Volver a mis direcciones
                                </button>

                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 hover:scale-105 transition transform"
                                >
                                    Guardar y continuar
                                </button>
                            </div>
                        </motion.form>
                    )}
                </>
            )}
        </div>
    );
};

export default CompraEnvio;
