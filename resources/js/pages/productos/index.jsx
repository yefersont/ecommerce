import React, { useEffect, useState } from "react";
import ProductoCard from "../../components/ProductosCard";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Modal from "../../components/Modal"; 
import ProductoForm from "../productos/ProductoForm";


const ProductosPage = ( onClose) => {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();
    const [modalAbierto, setModalAbierto] = useState(false);

    const fetchProductos = () => {
        fetch("http://127.0.0.1:8000/api/productos")
          .then((response) => response.json())
          .then((data) => setProductos(data))
          .catch((error) => console.error("Error al obtener los productos:", error));
      };
      
      useEffect(() => {
        fetchProductos();
      }, []);


    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Productos</h1>
                <button
                    onClick={() => setModalAbierto(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                >
                    <Plus size={18} /> Agregar Producto
                </button>
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
