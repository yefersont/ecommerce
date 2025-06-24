import React, { useEffect, useState } from "react";
import ProductoCard from "../../components/ProductosCard";
import { Plus } from "lucide-react";
import Modal from "../../components/Modal";
import ProductoForm from "../productos/ProductoForm";
import Loader from "../../components/Loader";
import { useCompra } from "../../components/context/CompraContext";
import axios from "axios";
import { motion } from "framer-motion";

const ProductosPage = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const idUsuario = localStorage.getItem("idUsuarios");
    const role = localStorage.getItem("role");
    const [loading, setLoading] = useState(false);
    const {
        categoriaSeleccionada,
        setCategoriaSeleccionada,
        busqueda,
        setBusqueda,
        precioSeleccionado,
        setPrecioSeleccionado,
    } = useCompra();

    const fetchCategorias = () => {
        axios
            .get("http://127.0.0.1:8000/api/categorias")
            .then((response) => {
                setCategorias(response.data);
            })
            .catch((error) =>
                console.error("Error al cargar categorías:", error)
            );
    };

    const filtrarProductos = (nombre, categoriaId, rangoPrecio) => {
        setLoading(true);

        const params = new URLSearchParams();

        if (nombre) params.append("Nombre", nombre);
        if (categoriaId) params.append("Categoria_idCategoria", categoriaId);

        if (rangoPrecio) {
            const [min, max] = rangoPrecio.split("-");
            params.append("PrecioMin", min);
            params.append("PrecioMax", max);
        }

        axios
            .get(
                `http://127.0.0.1:8000/api/productos/filtrar?${params.toString()}`
            )
            .then((response) => {
                console.log("Respuesta del backend:", response.data);
                setProductos(response.data);
            })
            .catch((error) => {
                console.error("Error al filtrar productos:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleBuscar = () => {
        filtrarProductos(busqueda, categoriaSeleccionada, precioSeleccionado);

        if (busqueda.trim() && idUsuario) {
            axios
                .post("http://127.0.0.1:8000/api/historial-busqueda", {
                    usuario_id: idUsuario,
                    termino_busqueda: busqueda,
                })
                .catch((error) => {
                    console.error("Error al guardar historial:", error);
                });
        }
    };

    useEffect(() => {
        filtrarProductos(busqueda, categoriaSeleccionada, precioSeleccionado);
        fetchCategorias();
    }, []);

    return (
        <div className="p-6 min-h-screen bg-white">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-semibold text-gray-800">
                    Productos Disponibles
                </h1>

                {role === "1" && (
                    <button
                        onClick={() => setModalAbierto(true)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md shadow"
                    >
                        + Agregar Producto
                    </button>
                )}
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
                {/* Precio */}
                <select
                    className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                    value={precioSeleccionado}
                    onChange={(e) => {
                        const precio = e.target.value;
                        setPrecioSeleccionado(precio);
                        filtrarProductos(
                            busqueda,
                            categoriaSeleccionada,
                            precio
                        );
                    }}
                >
                    <option value="">Todos los precios</option>
                    <option value="0-200">0 - 200 USD</option>
                    <option value="201-500">201 - 500 USD</option>
                    <option value="501-1000">501 - 1000 USD</option>
                    <option value="1001-1500">1001 - 1500 USD</option>
                </select>

                {/* Categoría */}
                <select
                    className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                    value={categoriaSeleccionada}
                    onChange={(e) => {
                        const id = e.target.value;
                        setCategoriaSeleccionada(id);
                        filtrarProductos(busqueda, id, precioSeleccionado);
                    }}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((categoria) => (
                        <option
                            key={categoria.idCategoria}
                            value={categoria.idCategoria}
                        >
                            {categoria.Nombre}
                        </option>
                    ))}
                </select>

                {/* Buscador */}
                <div className="flex gap-2 w-full md:flex-1">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleBuscar();
                        }}
                    />
                    <button
                        onClick={handleBuscar}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md shadow"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            {/* Lista de productos */}
            {loading ? (
                <Loader />
            ) : productos.length === 0 ? (
                <p className="text-center text-gray-500 py-16">
                    No se encontraron productos.
                </p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {productos.map((producto) => (
                        <ProductoCard
                            key={producto.idProductos}
                            producto={producto}
                        />
                    ))}
                </div>
            )}

            {/* Modal para agregar producto */}
            <Modal
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                title="Agregar Producto"
            >
                <ProductoForm
                    onClose={() => setModalAbierto(false)}
                    onProductoCreado={() =>
                        filtrarProductos(
                            busqueda,
                            categoriaSeleccionada,
                            precioSeleccionado
                        )
                    }
                />
            </Modal>
        </div>
    );
};

export default ProductosPage;
