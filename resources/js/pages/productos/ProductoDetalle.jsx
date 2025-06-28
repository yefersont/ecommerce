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
import ProductoCard from "../../components/ProductosCard";

const ProductoDetalle = () => {
    const { id } = useParams();

    const [producto, setProducto] = useState("");
    const [productoCategoria, setProductoCategoria] = useState([]);
    const [comentario, setComentario] = useState("");
    const [openReplyId, setOpenReplyId] = useState(null);
    const [respuestas, setRespuestas] = useState({});
    const [comentarioPadreId, setComentarioPadreId] = useState(null);
    const [modalImagenAbierto, setModalImagenAbierto] = useState(false); // Modal para la imagen
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false); // Modal para editar el producto
    const [isZoomed, setIsZoomed] = useState(false); // Estado para el zoom
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 }); // Para controlar la posición del zoom
    const navigate = useNavigate();
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(false);
    const role = localStorage.getItem("role");
    const idUsuario = localStorage.getItem("idUsuarios");

    const ShowProduct = (id) => {
        setLoading(true);
        axios
            .get(`http://127.0.0.1:8000/api/productos/${id}`)
            .then((response) => {
                const productoObtenido = response.data;
                setProducto(productoObtenido);
                console.log("Producto obtenido:", productoObtenido);
                setLoading(false);

                if (productoObtenido.Categoria_idCategoria) {
                    ProductRelation(
                        productoObtenido.Categoria_idCategoria,
                        productoObtenido.idProductos
                    );
                }
            })
            .catch((error) =>
                console.error("Error al obtener el producto:", error)
            );
    };

    const ProductRelation = (idCategoria, idProductoActual) => {
        axios
            .get(
                `http://127.0.0.1:8000/api/producto-categoria/${idCategoria}?excluir=${idProductoActual}`
            )
            .then((res) => {
                setProductoCategoria(res.data);
            })
            .catch((err) => console.error("Error ", err));
    };

    useEffect(() => {
        ShowProduct(id);
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
                    navigate("/productos");
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
        axios
            .post(`http://127.0.0.1:8000/api/carrito`, {
                Productos_idProducts: id,
                Cantidad: cantidad,
                Usuarios_idUsuarios: idUsuario,
            })
            .then(() => {
                Swal.fire({
                    title: "¡Agregado al Carrito!",
                    text: "El producto fue añadido correctamente 🛒",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#facc15",
                    background: "#ffffff",
                    color: "#333333",
                });

                axios
                    .get(`http://127.0.0.1:8000/api/productos/${id}`)
                    .then((response) => {
                        setProducto(response.data);
                    })
                    .catch((error) =>
                        console.error("Error al actualizar el stock:", error)
                    );
            })
            .catch(() => {
                Swal.fire({
                    title: "No hay stock de este producto por el momento!",
                    icon: "warning",
                    confirmButtonText: "Aceptar",
                });
            });
    };

    const HandleComentario = (e, comentarioPadreId = null) => {
        e.preventDefault();

        const textoComentario = comentarioPadreId
            ? respuestas[comentarioPadreId]?.trim()
            : comentario.trim();

        if (!textoComentario) {
            Swal.fire({
                title: "Campo vacío",
                text: "Escribe un comentario antes de enviar.",
                icon: "warning",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#facc15",
                background: "#ffffff",
                color: "#333333",
            });
            return;
        }

        const data = {
            Comentario: textoComentario,
            Usuarios_idUsuarios: idUsuario,
            Producto_idProducto: id,
        };

        if (comentarioPadreId) {
            data.Comentario_padre_id = comentarioPadreId;
        }

        axios
            .post(`http://127.0.0.1:8000/api/comentarios`, data)
            .then(() => {
                Swal.fire({
                    title: "¡Comentario enviado!",
                    text: comentarioPadreId
                        ? "Tu respuesta fue publicada 📨"
                        : "Gracias por tu opinión 📝",
                    icon: "success",
                    confirmButtonText: "Cerrar",
                    confirmButtonColor: "#facc15",
                    background: "#ffffff",
                    color: "#333333",
                });

                axios
                    .get(`http://127.0.0.1:8000/api/productos/${id}`)
                    .then((res) => setProducto(res.data));

                setComentario("");
                setOpenReplyId(null);
                setRespuestas((prev) => ({
                    ...prev,
                    [comentarioPadreId]: "",
                }));
            })
            .catch((error) => {
                console.error("Error al enviar el comentario:", error);
                Swal.fire("Error", "No se pudo enviar el comentario.", "error");
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
                    className="p-6"
                >
                    <div className="max-w-6xl mx-auto  bg-white rounded-xl shadow-lg overflow-hidden md:flex">
                        {/* Imagen con zoom */}
                        <div className="md:w-1/2 p-6 flex items-center justify-center">
                            <div
                                className="relative w-full aspect-square max-w-sm border rounded-lg overflow-hidden cursor-pointer shadow"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onClick={() => setModalImagenAbierto(true)}
                                onMouseMove={handleMouseMove}
                                style={{
                                    backgroundImage: `url(${imagenSrc})`,
                                    backgroundSize: isZoomed ? "200%" : "100%",
                                    backgroundPosition: `${
                                        (zoomPos.x / 400) * 100
                                    }% ${(zoomPos.y / 400) * 100}%`,
                                    backgroundRepeat: "no-repeat",
                                }}
                            ></div>
                        </div>

                        {/* Detalles del producto */}
                        <div className="md:w-1/2 p-8 space-y-6 flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {producto.Nombre}
                                </h1>
                                <p className="text-gray-700 mb-4 whitespace-pre-line">
                                    {producto.Descripcion}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Disponibles: {producto.Stock} Unds
                                </p>

                                <div className="text-2xl font-semibold text-yellow-500 mt-2">
                                    $
                                    {parseFloat(producto.Precio).toLocaleString(
                                        "es-CO"
                                    )}
                                </div>
                            </div>

                            {/* Controles */}
                            <div className="space-y-4">
                                {/* Selector cantidad */}
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-gray-700">
                                        Cantidad:
                                    </span>
                                    <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
                                        <button
                                            onClick={() =>
                                                setCantidad((prev) =>
                                                    Math.max(1, prev - 1)
                                                )
                                            }
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-200"
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
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {producto.Stock === 0 && (
                                    <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl shadow-sm mt-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M12 2a10 10 0 11-10 10A10 10 0 0112 2z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium">
                                            Este producto no está disponible por
                                            el momento. Sin stock.
                                        </span>
                                    </div>
                                )}

                                {/* Botones acción */}
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <button
                                        className={`py-2 flex items-center justify-center gap-2 rounded transition-colors duration-200 ${
                                            producto.Stock === 0
                                                ? "bg-yellow-300 text-black opacity-60"
                                                : "bg-yellow-400 hover:bg-yellow-500 text-black"
                                        }`}
                                        onClick={addToCart}
                                        disabled={producto.Stock === 0}
                                        style={{
                                            pointerEvents:
                                                producto.Stock === 0
                                                    ? "none"
                                                    : "auto", // evitar el cursor emoji sin usar cursor-not-allowed
                                        }}
                                    >
                                        <ShoppingCart size={20} />
                                        Agregar al Carrito
                                    </button>

                                    <button
                                        className="py-2 bg-[#3b4f68] text-yellow-400 hover:bg-[#232f3e] rounded"
                                        onClick={() => navigate("/productos")}
                                    >
                                        Volver
                                    </button>

                                    {role === "1" && (
                                        <>
                                            <button
                                                className="py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center gap-2"
                                                onClick={() =>
                                                    setModalEditarAbierto(true)
                                                }
                                            >
                                                <Pen size={20} />
                                                Editar
                                            </button>

                                            <button
                                                className="py-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center gap-2"
                                                onClick={EliminarProducto}
                                            >
                                                <Trash2 size={20} />
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productos Relacionados */}
                    <div className="max-w-6xl mx-auto mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Productos Relacionados
                        </h2>
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {productoCategoria.map((producto) => (
                                <ProductoCard
                                    key={producto.idProductos}
                                    producto={producto}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sección de Comentarios */}
                    <div className="max-w-6xl mx-auto mt-8 bg-white rounded-xl shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Comentarios o preguntas
                        </h2>
                        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <input
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                placeholder="Escribe tu pregunta o comentario..."
                                className="flex-1 border border-gray-300 rounded-md p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
                            />

                            <button
                                onClick={HandleComentario}
                                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-2 rounded whitespace-nowrap"
                            >
                                Enviar
                            </button>
                        </div>
                        {producto.comentarios?.length > 0 ? (
                            <ul className="space-y-4 mt-8">
                                {producto.comentarios
                                    .filter(
                                        (comentario) =>
                                            comentario.Comentario_padre_id ===
                                            null
                                    )
                                    .map((comentario) => (
                                        <li
                                            key={comentario.idComentario}
                                            className="border-b pb-4 text-gray-800 bg-white rounded-md p-4"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="font-semibold text-sm text-yellow-600">
                                                    {comentario.usuario?.Name ??
                                                        "Usuario desconocido"}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {comentario.Fecha}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mt-2">
                                                {comentario.Comentario}
                                            </p>

                                            {/* Botón responder */}
                                            <div className="mt-3">
                                                <button
                                                    className="text-sm text-yellow-500 font-semibold hover:underline"
                                                    onClick={() =>
                                                        setOpenReplyId(
                                                            openReplyId ===
                                                                comentario.idComentario
                                                                ? null
                                                                : comentario.idComentario
                                                        )
                                                    }
                                                >
                                                    Responder
                                                </button>
                                            </div>

                                            {openReplyId ===
                                                comentario.idComentario && (
                                                <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4 bg-gray-50 rounded-md p-3">
                                                    <textarea
                                                        placeholder="Escribe tu respuesta..."
                                                        rows={2}
                                                        value={
                                                            respuestas[
                                                                comentario
                                                                    .idComentario
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            setRespuestas(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [comentario.idComentario]:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                                                    ></textarea>
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-1 rounded"
                                                            onClick={(e) =>
                                                                HandleComentario(
                                                                    e,
                                                                    comentario.idComentario
                                                                )
                                                            }
                                                        >
                                                            Enviar respuesta
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setOpenReplyId(
                                                                    null
                                                                )
                                                            }
                                                            className="text-sm text-gray-600 hover:underline"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Respuestas anidadas */}
                                            {producto.comentarios
                                                .filter(
                                                    (respuesta) =>
                                                        respuesta.Comentario_padre_id ===
                                                        comentario.idComentario
                                                )
                                                .map((respuesta) => (
                                                    <div
                                                        key={
                                                            respuesta.idComentario
                                                        }
                                                        className="mt-4 ml-4 border-l-2 border-yellow-300 pl-4 bg-gray-50 rounded-md p-3"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div className="font-medium text-xs text-yellow-600">
                                                                {respuesta
                                                                    .usuario
                                                                    ?.Name ??
                                                                    "Usuario desconocido"}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {
                                                                    respuesta.Fecha
                                                                }
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700 mt-1 text-sm">
                                                            {
                                                                respuesta.Comentario
                                                            }
                                                        </p>
                                                    </div>
                                                ))}
                                        </li>
                                    ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mt-5">
                                Este producto aún no tiene comentarios.
                            </p>
                        )}
                    </div>

                    {/* Modal Imagen */}
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
                                    onClick={() => setModalImagenAbierto(false)}
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

                    {/* Modal Editar */}
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
                </motion.div>
            )}
        </div>
    );
};

export default ProductoDetalle;
