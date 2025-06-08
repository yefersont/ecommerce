import { createContext, useContext, useState } from "react";

const CompraContext = createContext();

export const CompraProvider = ({ children }) => {
    const [metodoPagoContext, setMetodoPagoContext] = useState(null);
    const [datosEnvio, setDatosEnvio] = useState(null);

    return (
        <CompraContext.Provider
            value={{
                metodoPagoContext,
                setMetodoPagoContext,
                datosEnvio,
                setDatosEnvio,
            }}
        >
            {children}
        </CompraContext.Provider>
    );
};

export const useCompra = () => useContext(CompraContext);
