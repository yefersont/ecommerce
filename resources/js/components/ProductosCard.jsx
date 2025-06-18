import React from "react";
import { Link } from "react-router-dom";

const ProductoCard = ({ producto }) => {
    return (
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
            <Link to={`/producto/${producto.idProductos}`}>
                {/* Imagen */}
                <div className="bg-white h-60 w-full overflow-hidden rounded-md flex items-center justify-center">
                    <img
                        src={`data:image/jpeg;base64,${producto.Imagen}`}
                        alt={producto.Nombre}
                        className="h-full object-contain p-2"
                    />
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col justify-between h-[160px]">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {producto.Nombre}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {producto.Descripcion}
                    </p>

                    <div className="mt-3 text-right">
                        <span className="text-xl font-bold text-yellow-500">
                            ${producto.Precio}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductoCard;
