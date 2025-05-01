import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";

const ProductoFormEditar = ({ producto, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState(null);
  const [categoria, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Si 'producto' tiene valores, se asignan a los estados
    if (producto) {
      setNombre(producto.Nombre || "");
      setDescripcion(producto.Descripcion || "");
      setCategoriaId(producto.Categoria_idCategoria || "");
      setPrecio(producto.Precio || "");
      setStock(producto.Stock || "");
      // Aquí podrías usar una lógica para manejar la imagen si es necesario
    }

    axios.get("http://127.0.0.1:8000/api/categorias")
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error("Error al obtener categorías:", error);
      });
  }, [producto]); // El useEffect se dispara cuando el 'producto' cambia


  // Funcion para editar un producto 
  const handleEditar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Nombre', nombre);
    formData.append('Descripcion', descripcion);
    formData.append('Categoria_idCategoria', categoriaId);
    formData.append('Precio', precio);
    formData.append('Stock', stock);
    formData.append('Imagen', imagen); // Asegúrate de que 'imagen' es un archivo tipo File

    try {
       console.log(producto)
        await axios.post(`http://127.0.0.1:8000/api/productos/${producto.idProductos}?_method=PUT`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Producto actualizado exitosamente');
        Swal.fire({
                  title: 'Actualizado!',
                  text: 'Producto actualizado correctamente.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                });
        onClose();
        navigate('/productos');
        
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
};

  return (
    <div>
        <form onSubmit={handleEditar}>
            {/* Nombre */}
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-600">
                Nombre
                </label>
                <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
            </div>

        {/* Descripción */}
            <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-600">
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
                <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-600">
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
                <label htmlFor="precio" className="block text-sm font-medium text-gray-600">
                Precio
                </label>
                <input
                type="text"
                id="precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
            </div>

            {/* Stock */}
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-600">
                Stock
                </label>
                <input
                type="text"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
            </div>

            {/* Imagen */}
            <div>
                <label htmlFor="imagen" className="block text-sm font-medium text-gray-600">
                Imagen
                </label>
                <input
                type="file"
                id="imagen"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
            </div>

            {/* Botones */}
            <div className="flex justify-between gap-4 mt-6">
                <button
                type="submit"
                className="w-1/2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-300 text-sm"
                >
                Editar Producto
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
    </div>
  );
};

export default ProductoFormEditar;
