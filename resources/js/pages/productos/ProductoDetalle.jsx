import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pen, Trash2, ShoppingCart, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "../../components/Modal";
import ProductoFormEditar from "../productos/ProductoFormEditar";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

const ProductoDetalle = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState("");
    const [modalImagenAbierto, setModalImagenAbierto] = useState(false); // Modal para la imagen
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false); // Modal para editar el producto
    const [isZoomed, setIsZoomed] = useState(false); // Estado para el zoom
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 }); // Para controlar la posición del zoom
    const navigate = useNavigate();
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(false);
    const role = localStorage.getItem("role");
    const idUsuario = localStorage.getItem("idUsuarios");

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://127.0.0.1:8000/api/productos/${id}`)
            .then((response) => {
                setProducto(response.data);
                console.log("Producto obtenido:", response.data);
                setLoading(false);
            })
            .catch((error) =>
                console.error("Error al obtener el producto:", error)
            );
    }, [id]);

    const imagenSrc = producto.Imagen
        ? `data:image/jpeg;base64,${producto.Imagen}`
        : "sexo";

    // Función para manejar el movimiento del mouse sobre la imagen
    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setZoomPos({ x, y });
    };

    const EliminarProducto = () => {
        axios
            .delete(`http://127.0.0.1:8000/api/productos/${id}`)
            .then(() => {
                Swal.fire({
                    title: "¡Eliminado!",
                    text: "Producto eliminado con éxito.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    navigate("/productos"); // Redirige solo después de aceptar
                });
            })
            .catch(() => {
                Swal.fire({
                    title: "Error",
                    text: "Error al eliminar el producto",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            });
    };

    const addToCart = () => {
        console.log({
            Productos_idProducts: parseInt(id),
            Cantidad: cantidad,
            Usuarios_idUsuarios: parseInt(idUsuario),
        });
        axios
            .post(`http://127.0.0.1:8000/api/carrito`, {
                Productos_idProducts: id,
                Cantidad: cantidad,
                Usuarios_idUsuarios: idUsuario,
            })
            .then(() => {
                Swal.fire({
                    title: "¡Agregado al Carrito!",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                });
            })
            .catch(() => {
                Swal.fire({
                    title: "Error al agreagar al Carrito!",
                    icon: "warning",
                    confirmButtonText: "Aceptar",
                });
            });
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="p-4"
                >
                    <div className="p-6 mt-10">
                        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                            {/* Imagen con zoom */}
                            <div className="md:col-span-1 bg-white shadow p-4">
                                <div
                                    className="relative w-full aspect-square cursor-pointer overflow-hidden border"
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => setIsZoomed(false)}
                                    onClick={() => setModalImagenAbierto(true)}
                                    onMouseMove={handleMouseMove}
                                    style={{
                                        backgroundImage: `url(${imagenSrc})`,
                                        backgroundSize: isZoomed
                                            ? "200%"
                                            : "100%",
                                        backgroundPosition: `${
                                            (zoomPos.x / 400) * 100
                                        }% ${(zoomPos.y / 400) * 100}%`,
                                        backgroundRepeat: "no-repeat",
                                    }}
                                ></div>
                            </div>

                            {/* Detalles del producto */}
                            <div className="md:col-span-2 bg-white shadow p-8 space-y-6">
                                <h1 className="text-3xl font-semibold text-gray-900">
                                    {producto.Nombre}
                                </h1>
                                <p className="text-gray-700 text-lg">
                                    {producto.Descripcion}
                                </p>
                                <p className="text-gray-600">
                                    Disponibles: {producto.Stock} Unds
                                </p>

                                {/* Precio normal */}
                                <div className="text-xl text-gray-900">
                                    $
                                    {parseFloat(producto.Precio).toLocaleString(
                                        "es-CO"
                                    )}
                                </div>

                                {/* Selector de cantidad */}
                                <div className="flex items-center">
                                    <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
                                        <button
                                            onClick={() =>
                                                setCantidad((prev) =>
                                                    Math.max(1, prev - 1)
                                                )
                                            }
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={producto.Stock}
                                            value={cantidad}
                                            onChange={(e) => {
                                                const valor = Number(
                                                    e.target.value
                                                );
                                                if (valor > producto.Stock) {
                                                    Swal.fire(
                                                        "¡Stock insuficiente!",
                                                        "No puedes seleccionar más de lo disponible.",
                                                        "warning"
                                                    );
                                                    setCantidad(producto.Stock);
                                                } else {
                                                    setCantidad(
                                                        Math.max(1, valor)
                                                    );
                                                }
                                            }}
                                            className="w-14 text-center bg-transparent outline-none text-gray-900 font-medium"
                                        />
                                        <button
                                            onClick={() =>
                                                setCantidad((prev) =>
                                                    prev < producto.Stock
                                                        ? prev + 1
                                                        : prev
                                                )
                                            }
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <button
                                        className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black flex items-center justify-center gap-2"
                                        onClick={addToCart}
                                    >
                                        <ShoppingCart size={20} />
                                        Agregar al Carrito
                                    </button>
                                    <button
                                        className="w-full py-2 bg-[#3b4f68] text-yellow-400   hover:bg-[#232f3e]"
                                        onClick={() => navigate("/productos")}
                                    >
                                        Volver
                                    </button>

                                    {role === "1" && (
                                        <>
                                            <button
                                                className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded transition flex items-center"
                                                onClick={() =>
                                                    setModalEditarAbierto(true)
                                                }
                                            >
                                                <Pen
                                                    size={20}
                                                    className="mr-2"
                                                />
                                                Editar
                                            </button>
                                            <button
                                                className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded transition flex items-center"
                                                onClick={EliminarProducto}
                                            >
                                                <Trash2
                                                    size={20}
                                                    className="mr-2"
                                                />
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal de imagen ampliada */}
                        {modalImagenAbierto && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                                onClick={() => setModalImagenAbierto(false)}
                            >
                                <div
                                    className="relative max-w-4xl w-full p-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
                                        onClick={() =>
                                            setModalImagenAbierto(false)
                                        }
                                    >
                                        <X size={24} />
                                    </button>
                                    <img
                                        src={imagenSrc}
                                        alt="Imagen ampliada"
                                        className="w-full max-h-[80vh] object-contain rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Modal de Edición */}
                        {modalEditarAbierto && (
                            <Modal
                                isOpen={modalEditarAbierto}
                                onClose={() => setModalEditarAbierto(false)}
                                title="Editar Producto"
                            >
                                <ProductoFormEditar
                                    producto={producto}
                                    onClose={() => setModalEditarAbierto(false)}
                                />
                            </Modal>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ProductoDetalle;
