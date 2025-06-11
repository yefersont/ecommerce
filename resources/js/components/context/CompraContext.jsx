import { createContext, useContext, useState } from "react";

const CompraContext = createContext();

export const CompraProvider = ({ children }) => {
    const [metodoPagoContext, setMetodoPagoContext] = useState(null);
    const [datosEnvio, setDatosEnvio] = useState(null);
    const [tarjetaSeleccionadaContext, setTarjetaSeleccionadaContext] =
        useState(null);

    // 🎯 NUEVOS estados para los filtros de productos
    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [precioSeleccionado, setPrecioSeleccionado] = useState("");

    return (
        <CompraContext.Provider
            value={{
                metodoPagoContext,
                setMetodoPagoContext,
                datosEnvio,
                setDatosEnvio,
                tarjetaSeleccionadaContext,
                setTarjetaSeleccionadaContext,

                // Exportar también los filtros
                busqueda,
                setBusqueda,
                categoriaSeleccionada,
                setCategoriaSeleccionada,
                precioSeleccionado,
                setPrecioSeleccionado,
            }}
        >
            {children}
        </CompraContext.Provider>
    );
};

export const useCompra = () => useContext(CompraContext);
