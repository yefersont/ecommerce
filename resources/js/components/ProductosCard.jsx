import React from "react";
import { Link } from "react-router-dom";

import { ShoppingCart, Pen, Trash2 } from "lucide-react";

const ProductoCard = ({ producto }) => {
    return (
        <div className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex w-full relative">
            {/* Imagen */}

            <Link to={`/producto/${producto.idProductos}`} className="flex-1 flex gap-4">
            <div className="w-32 h-32 flex items-center justify-center border rounded-md bg-white p-2 flex-shrink-0">
                <img
                    src={`data:image/jpeg;base64,${producto.Imagen}`}
                    alt={producto.Nombre}
                    className="max-h-full object-contain"
                />
            </div>

            {/* Info principal */}
            <div className="flex-1 ml-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {producto.Nombre}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {producto.Descripcion}
                    </p>
                    <div className="text-lg font-bold text-gray-900">
                        ${producto.Precio}
                    </div>
                </div>

            </div>
            </Link>
        </div>
    );
};

export default ProductoCard;
