import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayouts";
import Productos from "./pages/productos";
import ProductoDetalle from "./pages/productos/ProductoDetalle";
import ProductosPorCategoria from "./pages/productos/ProductoPorCategoria";

function App() {
  return (
    <Routes>
      {/* Ruta raíz que redirige a /productos */}
      <Route
        index
        element={
          <MainLayout>
            <Productos />
          </MainLayout>
        }
      />
      {/* Ruta para productos */}
      <Route
        path="/productos"
        element={
          <MainLayout>
            <Productos />
          </MainLayout>
        }
      />
      {/* Ruta para el detalle de un producto */}
      <Route
        path="/producto/:id"
        element={
          <MainLayout>
            <ProductoDetalle />
          </MainLayout>
        }
      />
      <Route 
        path="/categoria/:id" 
        element={
        
          <MainLayout>
            <ProductosPorCategoria/>
          </MainLayout>  
          
        } />

    </Routes>
  );
}

export default App;
