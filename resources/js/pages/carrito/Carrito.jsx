import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Carrito = ({ onClose }) => {
  const [carrito, setCarrito] = useState([]);
  const idUsuario = localStorage.getItem("idUsuarios");

  const fetchCarrito = () => {
    axios
      .get(`http://127.0.0.1:8000/api/carrito/${idUsuario}`)
      .then((response) => {
        setCarrito(response.data);
        const cantidad  = response.data.length;
        console.log("Productos: ", cantidad)

      })
      .catch((error) => {
        console.log("Error al obtener los productos", error);
      });
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  const vaciarCarrito = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esto eliminará todos los productos del carrito.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8000/api/carrito/${idUsuario}/vaciar`)
          .then(() => {
            setCarrito([]);
            Swal.fire('Carrito vaciado', '', 'success');
            onClose();
          })
          .catch((error) => {
            console.log("Error al vaciar el carrito", error);
            Swal.fire('Error al vaciar el carrito', '', 'error');
          });
      }
    });
  };

  const eliminarProductoCarrito = (item) => {
    const idProducto = item.product.idProductos;

    axios
      .delete(`http://127.0.0.1:8000/api/carrito/${idUsuario}/producto/${idProducto}`)
      .then(() => {
        setCarrito(carrito.filter(p => p.idCarrito !== item.idCarrito));
        Swal.fire('Producto eliminado del carrito', '', 'success');
      })
      .catch((error) => {
        console.log("Error al eliminar el producto", error);
        Swal.fire('Error al eliminar el producto', '', 'error');
      });
  };

  const comprar = () => {
    Swal.fire('Compra realizada con éxito', 'Gracias por tu compra', 'success');
    // Aquí podrías enviar la compra al backend si es necesario
  };

  const totalGeneral = carrito.reduce((acc, item) => {
    const precio = parseFloat(item.product.Precio);
    const cantidad = parseInt(item.Cantidad);
    return acc + precio * cantidad;
  }, 0);

  return (
    <div className="p-4 max-h-[70vh] overflow-y-auto">
      {carrito.length === 0 ? (
        <p className="text-center text-gray-500">No hay productos en el carrito.</p>
      ) : (
        <>
          {carrito.map((item, index) => {
            const precioUnitario = parseFloat(item.product.Precio);
            const cantidad = parseInt(item.Cantidad);
            const total = precioUnitario * cantidad;

            return (
              <div key={index} className="flex items-center gap-4 mb-4 border-b pb-2">
                <img
                  src={`data:image/jpeg;base64,${item.product.Imagen}`}
                  alt="Producto"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.product.Nombre}</h3>
                  <p className="text-xs text-gray-500">Cantidad: {cantidad}</p>
                  <p className="text-xs text-gray-500">
                    Valor unitario: ${precioUnitario.toLocaleString("es-CO")}
                  </p>
                  <p className="text-xs text-gray-700 font-semibold">
                    Total: ${total.toLocaleString("es-CO")}
                  </p>
                </div>  
                <button
                  onClick={() => eliminarProductoCarrito(item)}
                  className="w-8 h-8 flex items-center justify-center text-white bg-gray-300 rounded-full hover:bg-gray-400 transition"
                  title="Eliminar producto"
                >
                  &minus;
                </button>
              </div>
            );
          })}
          <div className="mt-4 text-right font-bold text-lg border-t pt-2">
            Total general: ${totalGeneral.toLocaleString("es-CO")}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={vaciarCarrito}
              className="w-full py-2 text-base bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Vaciar carrito
            </button>
            <button
              onClick={comprar}
              className="w-full py-2 text-base bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Comprar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
