import React, { useEffect, useState } from "react";
import ProductoCard from "../../components/ProductosCard";
import { Plus } from "lucide-react";
import Modal from "../../components/Modal";
import ProductoForm from "../productos/ProductoForm";
import axios from "axios";

const ProductosPage = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const role = localStorage.getItem("role");





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

    const filtrarProductos = (nombre, categoriaId) => {
        const params = new URLSearchParams();
        if (nombre) params.append("Nombre", nombre);
        if (categoriaId) params.append("Categoria_idCategoria", categoriaId);

        axios
            .get(`http://127.0.0.1:8000/api/productos/filtrar?${params.toString()}`)
            .then(response => {
                console.log("Respuesta del backend:", response.data);
                setProductos(response.data);
            })
            .catch(error => {
                console.error("Error al filtrar productos:", error);
            });
    };


    useEffect(() => {
        filtrarProductos(busqueda, categoriaSeleccionada);
        fetchCategorias();
        
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Productos</h1>
                <div className="flex items-center gap-4">
                    {role === "1" && (
                        <button
                            onClick={() => setModalAbierto(true)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                        >
                            <Plus size={18} /> Producto
                        </button>
                    )}

                    <div className="flex w-full max-w-3xl mx-auto">
                        {/* <h3 className="text-gray-700 text-sm">filtrar por:</h3> */}
                        <select
                            className="border-t border-b border-l  border-gray-300 rounded-l-md px-4 py-2 bg-gray-100 text-sm text-gray-700 focus:outline-none"
                        >
                            <option value="">Todos los precios</option>
                            <option value="">00.0 - 200.0</option>
                        </select>

                        <select
                            className="border-t border-b  border-gray-300  px-4 py-2 bg-gray-100 text-sm text-gray-700 focus:outline-none"
                            value={categoriaSeleccionada}
                            onChange={(e) => {
                                const id = e.target.value;
                                setCategoriaSeleccionada(id);
                                filtrarProductos(busqueda, id);
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

                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            className="w-full border-t border-b border-r  bg-gray-100 border-gray-300 rounded-r-md px-20 py-2 focus:outline-none text-sm"
                            value={busqueda}
                            onChange={(e) => {
                                const valor = e.target.value;
                                setBusqueda(valor);
                                filtrarProductos(valor, categoriaSeleccionada);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {productos.map((producto) => (
                    <ProductoCard
                        key={producto.idProductos}
                        producto={producto}
                    />
                ))}
            </div>

            <Modal
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                title="Agregar Producto"
            >
                <ProductoForm
                    onClose={() => setModalAbierto(false)}
                    onProductoCreado={() =>
                        filtrarProductos(busqueda, categoriaSeleccionada)
                    }
                />
            </Modal>
        </div>
    );
};

export default ProductosPage;
