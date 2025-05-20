import React from "react";

const FiltroPrecio = () =>{

    return(
        <select
            name="Select"
            id="filtroPrecio"
            className="text-center w-full max-w-xs border  border-gray-300 rounded-lg px-1 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700"
        >
        <option value="" selected >
            Filtrar por Precio
            </option>
            <option value=""> $50 y $100</option>
            <option value=""> $100 y $200</option>
            <option value=""> $200 y $400</option>
        </select>
        
    
    );
}

export default FiltroPrecio;