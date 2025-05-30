import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ProductoForm = ({ onClose, onProductoCreado }) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [imagen, setImagen] = useState(null);
    const [categoria, setCategorias] = useState([]);
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/categorias")
            .then((response) => {
                setCategorias(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener categorías:", error);
            });
    }, []);

    const handleNombreChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setNombre(value);
        }
    };

    // Validaciones para solo números
    const handleNumeroChange = (e, setter) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setter(value);
        }
    };

    // Validación de Precio: solo números con hasta dos decimales
    const handlePrecioChange = (e) => {
        const value = e.target.value;
        if (/^\d+(\.\d{0,2})?$/.test(value)) {
            setPrecio(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Nombre", nombre);
        formData.append("Descripcion", descripcion);
        formData.append("Categoria_idCategoria", categoriaId);
        formData.append("Precio", precio);
        formData.append("Stock", stock);
        formData.append("Imagen", imagen); // Asegúrate de que 'imagen' es un archivo tipo File

        try {
            await axios.post("http://127.0.0.1:8000/api/productos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Producto creado exitosamente");
            Swal.fire({
                title: "Registrado!",
                text: "Producto registrado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            onClose();
            onProductoCreado();
        } catch (error) {
            console.error("Error al crear el producto:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* <h2 className="text-2xl font-semibold text-center text-gray-800">Agregar Producto</h2> */}

            {/* Nombre */}
            <div>
                <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-600"
                >
                    Nombre
                </label>
                <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => handleNombreChange(e)}
                    required
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
            </div>

            {/* Descripción */}
            <div>
                <label
                    htmlFor="descripcion"
                    className="block text-sm font-medium text-gray-600"
                >
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    rows="3"
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                ></textarea>
            </div>

            {/* Categoría */}
            <div>
                <label
                    htmlFor="categoriaId"
                    className="block text-sm font-medium text-gray-600"
                >
                    Categoría
                </label>
                <select
                    id="categoriaId"
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    required
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                    <option value="">Seleccione una categoría</option>
                    {categoria.map((cat) => (
                        <option key={cat.idCategoria} value={cat.idCategoria}>
                            {cat.Nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Precio */}
            <div>
                <label
                    htmlFor="precio"
                    className="block text-sm font-medium text-gray-600"
                >
                    Precio
                </label>
                <input
                    type="text"
                    id="precio"
                    value={precio}
                    onChange={handlePrecioChange} // Validación de precio
                    required
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
            </div>

            {/* Stock */}
            <div>
                <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-600"
                >
                    Stock
                </label>
                <input
                    type="text"
                    id="stock"
                    value={stock}
                    onChange={(e) => handleNumeroChange(e, setStock)}
                    required
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
            </div>

            {/* Imagen */}
            <div>
                <label
                    htmlFor="imagen"
                    className="block text-sm font-medium text-gray-600"
                >
                    Imagen
                </label>
                <input
                    type="file"
                    id="imagen"
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files[0])}
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                />
            </div>

            {/* Botones */}
            <div className="flex justify-between gap-4 mt-6">
                <button
                    type="submit"
                    className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-300 text-sm"
                >
                    Registrar Producto
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-300 text-sm"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default ProductoForm;
