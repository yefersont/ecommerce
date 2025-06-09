import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayouts";
import Productos from "./pages/productos";
import ProductoDetalle from "./pages/productos/ProductoDetalle";
// import ProductosPorCategoria from "./pages/productos/ProductoPorCategoria";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import Usuarios from "./pages/usuarios/Usuarios";
import CompraDetalle from "./pages/compra/CompraDetalle";
import CompraEnvio from "./pages/compra/CompraForm";
import SeleccionarTarjeta from "./pages/compra/SeleccionarTarjeta";
import ResumenPago from "./pages/compra/ResumenPago";
import { CompraProvider } from "./components/context/CompraContext";
const token = localStorage.getItem("token");

if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
function App() {
    useEffect(() => {
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // El token ha expirado
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }
        );
    }, []);

    return (
        <CompraProvider>
            <Routes>
                {/* Ruta de login */}
                <Route path="/login" element={<Login />} />

                {/* Rutas protegidas */}
                <Route
                    path="/productos"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Productos />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/producto/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ProductoDetalle />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Rutas protegidas */}
                <Route
                    path="/usuarios"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Usuarios />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/compra-detalle"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <CompraDetalle />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/formulario-envio"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <CompraEnvio />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/seleccionar-tarjeta"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <SeleccionarTarjeta />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/resumen-pago"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ResumenPago />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </CompraProvider>
    );
}

export default App;
