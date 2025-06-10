import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import { useCompra } from "../../components/context/CompraContext";
import { CreditCard, MapPin, ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResumenPago = () => {
    const idUsuario = localStorage.getItem("idUsuarios");
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(true);
    const { datosEnvio, tarjetaSeleccionadaContext, metodoPagoContext } =
        useCompra();
    const navigate = useNavigate();

    const dataenvio = {
        Usuarios_idUsuarios: parseInt(idUsuario),
        Identificacion: parseInt(datosEnvio.identificacion),
        Telefono: datosEnvio.telefono,
        Correo: datosEnvio.correo,
        Departamentos_idDepartamentos: parseInt(datosEnvio.departamento),
        Ciudades_idCiudades: parseInt(datosEnvio.ciudad),
        Direccion: datosEnvio.direccionPrincipal,
        DireccionAlternativa: datosEnvio.direccionAlternativa || null,
        CodigoPostal: datosEnvio.codigoPostal || null,
        Observaciones: datosEnvio.instrucciones || null,
    };

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/carrito/${idUsuario}`)
            .then((res) => {
                setCarrito(res.data);
                console.log("DatosEnvio", dataenvio);
            })
            .catch((err) => console.error("Error al obtener el carrito", err))
            .finally(() => setLoading(false));
    }, [idUsuario]);

    const calcularTotal = () => {
        return carrito.reduce(
            (total, item) => total + item.product.Precio * item.Cantidad,
            0
        );
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        let idDatosEnvio = null;
        let idOrden = null;

        try {
            const resEnvio = await axios.post(
                "http://127.0.0.1:8000/api/datosenvio",
                dataenvio
            );
            idDatosEnvio = resEnvio.data.idDatosEnvio;
            console.log("✅ Datos de envío insertados:", idDatosEnvio);

            const dataorden = {
                Total: parseFloat(calcularTotal()),
                MetodosPago_idMetodosPago: parseInt(metodoPagoContext),
                Tarjetas_idTarjetas: tarjetaSeleccionadaContext
                    ? parseInt(tarjetaSeleccionadaContext)
                    : null,
                Datosenvio_idDatosenvio: parseInt(idDatosEnvio),
            };

            const resOrden = await axios.post(
                "http://127.0.0.1:8000/api/ordencompra",
                dataorden
            );
            idOrden = resOrden.data.idOrden;
            console.log("✅ Orden creada:", idOrden);

            const detalles = carrito.map((item) => ({
                Orden_id: parseInt(idOrden),
                Producto_id: parseInt(item.product.idProductos),
                Cantidad: parseInt(item.Cantidad),
                PrecioUnitario: parseFloat(item.product.Precio),
            }));

            try {
                await axios.post(
                    "http://127.0.0.1:8000/api/ordendetalle",
                    detalles,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("✅ Detalles guardados correctamente");
            } catch (error) {
                console.error(
                    "❌ Error al guardar los detalles:",
                    error.response?.data || error.message
                );
                Swal.fire(
                    "Error",
                    "No se pudieron guardar los detalles de la orden",
                    "error"
                );
            }

            console.log("✅ Detalles de orden registrados");

            Swal.fire({
                title: "Compra Realizada!",
                text: "La compra se realizó con éxito. Puedes visualizar tus compras en la opción de Mis compras.",
                icon: "success",
                confirmButtonText: "Aceptar",
            }).then(async () => {
                try {
                    await axios.delete(
                        `http://127.0.0.1:8000/api/carrito/${idUsuario}/vaciar`
                    );
                    navigate("/productos");
                } catch (error) {
                    console.error("❌ Error al vaciar el carrito", error);
                    Swal.fire("Error", "No se pudo vaciar el carrito", "error");
                }
            });
        } catch (error) {
            console.error("❌ Error en el proceso de compra", error);
            alert("Hubo un problema al procesar tu compra.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        Confirmación de Compra
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Columna izquierda */}
                        <div className="bg-white rounded-2xl shadow-lg border p-6 space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                    Datos de Envío
                                </h3>
                                {datosEnvio ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre completo
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        datosEnvio.nombreCompleto
                                                    }
                                                    disabled
                                                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Identificacion
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        datosEnvio.identificacion
                                                    }
                                                    disabled
                                                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md px-4 py-2"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Dirección principal
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    datosEnvio.direccionPrincipal
                                                }
                                                disabled
                                                className="w-full bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md px-4 py-2"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Departamento
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        datosEnvio.departamento
                                                    }
                                                    disabled
                                                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Ciudad
                                                </label>
                                                <input
                                                    type="text"
                                                    value={datosEnvio.ciudad}
                                                    disabled
                                                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md px-4 py-2"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Teléfono
                                            </label>
                                            <input
                                                type="text"
                                                value={datosEnvio.telefono}
                                                disabled
                                                className="w-full bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md px-4 py-2"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">
                                        No se han ingresado datos de envío.
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                    Tarjeta Seleccionada
                                </h3>

                                {tarjetaSeleccionadaContext ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tipo
                                                </label>
                                                <input
                                                    type="text"
                                                    value="Crédito" // puedes cambiar esto si tienes más info
                                                    disabled
                                                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Últimos dígitos
                                                </label>
                                                <input
                                                    type="text"
                                                    value="**** **** **** 1234" // aquí deberías mostrar el valor real con máscara
                                                    disabled
                                                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md px-4 py-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">
                                        No se ha seleccionado tarjeta.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Columna derecha */}
                        <div className="bg-white rounded-2xl shadow-lg border p-6 flex flex-col max-h-[550px]">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <ShoppingBasket className="w-5 h-5 text-gray-600" />
                                Productos en el Carrito
                            </h3>

                            {carrito.length > 0 ? (
                                <>
                                    <ul className="overflow-y-auto pr-2 divide-y divide-gray-200 mb-4 flex-1">
                                        {carrito.map((item) => (
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

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center text-lg font-semibold text-gray-800 mb-4">
                                            <span>Total:</span>
                                            <span className="text-green-700 text-2xl font-bold">
                                                $
                                                {calcularTotal().toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <button
                                                className=" flex-1 bg-gray-300 hover:bg-gray-100 text-black font-bold py-2 px-2 rounded shadow w-full"
                                                onClick={() => {
                                                    alert("Proceso cancelado");
                                                    navigate("/productos");
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={onSubmit}
                                                className=" flex-1 bg-yellow-300 hover:bg-yellow-200 text-black font-bold py-2 px-2 rounded shadow w-full"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 italic">
                                    El carrito está vacío.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ResumenPago;
