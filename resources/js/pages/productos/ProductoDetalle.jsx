import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pen, Trash2, ShoppingCart, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Modal from "../../components/Modal"; 
import ProductoFormEditar from "../productos/ProductoFormEditar";


const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [modalImagenAbierto, setModalImagenAbierto] = useState(false); // Modal para la imagen
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false); // Modal para editar el producto
  const [isZoomed, setIsZoomed] = useState(false); // Estado para el zoom
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 }); // Para controlar la posición del zoom
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/productos/${id}`)
      .then((res) => res.json())
      .then((data) => setProducto(data))
      .catch((error) => console.error("Error al obtener el producto:", error));
  }, [id]);

  if (!producto) return <div className="p-4">Cargando producto...</div>;

  const imagenSrc = producto.Imagen
    ? `data:image/jpeg;base64,${producto.Imagen}`
    : "https://via.placeholder.com/150";

  // Función para manejar el movimiento del mouse sobre la imagen
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setZoomPos({ x, y });
  };

  const EliminarProducto = () => {
    axios.delete(`http://127.0.0.1:8000/api/productos/${id}`)
      .then(() => {
        Swal.fire({
          title: '¡Eliminado!',
          text: 'Producto eliminado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate('/productos'); // Redirige solo después de aceptar
        });
      })
      .catch(() => {
        Swal.fire({
          title: 'Error',
          text: 'Error al eliminar el producto',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
  };

  return (
    <div className="p-4 relative">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen con zoom */}
        <div
          className="cursor-pointer group w-[400px] h-[400px] overflow-hidden border rounded-lg"
          onMouseEnter={() => setIsZoomed(true)} 
          onMouseLeave={() => setIsZoomed(false)}
          onClick={() => setModalImagenAbierto(true)}  // Abre el modal de imagen
          onMouseMove={handleMouseMove} 
          style={{
            backgroundImage: `url(${imagenSrc})`,
            backgroundSize: isZoomed ? "200%" : "100%", // Zoom solo cuando está activado
            backgroundPosition: `${(zoomPos.x / 400) * 100}% ${(zoomPos.y / 400) * 100}%`, // Zoom basado en la posición del mouse
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Detalles del producto */}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h1 className="text-3xl font-bold mb-2">{producto.Nombre}</h1>
            <p className="text-gray-700 mb-4">{producto.Descripcion}</p>
            <div className="text-2xl font-bold text-gray-900 mb-4">
              ${parseFloat(producto.Precio).toLocaleString("es-CO")}
            </div>
          </div>

          <div className="flex gap-2 justify-start mt-6">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center">
              <ShoppingCart size={20} className="mr-2" />
              Agregar al Carrito
            </button>
            <button 
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
              onClick={() => setModalEditarAbierto(true)} // Abre el modal de edición
            >
              <Pen size={20} className="mr-2" />
              Editar
            </button>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
              onClick={EliminarProducto}
            >
              <Trash2 size={20} className="mr-2" />
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de imagen ampliada */}
      {modalImagenAbierto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImagenAbierto(false)} // Cierra el modal al hacer clic fuera
        >
          <div
            className="relative max-w-4xl w-full p-4"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer click en la imagen
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

      {/* Modal de Edición */}
      {modalEditarAbierto && (
        <Modal
          isOpen={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          title="Editar Producto"
        >
          {/* Aquí puedes poner el formulario de edición del producto */}
          <ProductoFormEditar 
            producto={producto}
            onClose={() => setModalEditarAbierto(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductoDetalle;
