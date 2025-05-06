import React, { useEffect, useState } from "react";
import ProductoCard from "../../components/ProductosCard";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Modal from "../../components/Modal"; 
import ProductoForm from "../productos/ProductoForm";
import axios from "axios";

const ProductosPage = () => {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const role = localStorage.getItem('role');

    const fetchProductos = () => {
        axios
            .get("http://127.0.0.1:8000/api/productos")
            .then((response) => setProductos(response.data))
            .catch((error) => 
                console.error("Error al obtener los productos:", error)
        );
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const buscarPorNombre = (nombre) => {

        if (!nombre.trim()) {
            fetchProductos();
            console.log("Sin buscar");
        }else{
            axios
            .get("http://127.0.0.1:8000/api/productos/buscar", {
                params: { nombre }
            })
            .then((response) => setProductos(response.data))
            .catch((error) =>
                console.error("Error al buscar productos:", error)
            );
        }
    };

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
                            <Plus size={18} /> Agregar Producto
                        </button>
                    )}

                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="border border-gray-300 rounded-md px-40 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={busqueda}
                        onChange={(e) => {
                            const valor = e.target.value;
                            setBusqueda(valor);
                            buscarPorNombre(valor);
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {productos.map((producto) => (
                    <ProductoCard key={producto.idProductos} producto={producto} />
                ))}
            </div>

            <Modal
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                title="Agregar Producto"
            >
                <ProductoForm 
                    onClose={() => setModalAbierto(false)}
                    onProductoCreado={fetchProductos}
                />
            </Modal>
        </div>
    );
};

export default ProductosPage;
