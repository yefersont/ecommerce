import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductoCard from "../../components/ProductosCard";
import MainLayout from "../../Layouts/MainLayouts";

const ProductosPorCategoria = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/categorias/${id}/productos`)
      .then((res) => {
        setProductos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Productos por categoria</h1>

        {loading ? (
          <p className="text-gray-600">Cargando productos...</p>
        ) : productos.length > 0 ? (
            <div className="flex flex-col gap-4">
            {productos.map((producto) => (
              <ProductoCard key={producto.idProductos} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay productos en esta categoría.</p>
        )}
      </div>
  );
};

export default ProductosPorCategoria;
