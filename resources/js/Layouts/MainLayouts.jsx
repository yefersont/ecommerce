import React, { useState, useEffect } from "react";
import axios from "axios"; // Asegúrate de tener axios instalado
import { Link } from "react-router-dom";
import {
  ShoppingBasket,
  Menu,
  Settings,
  LogOut,
  ChartBarStacked,
  ChevronDown,
  ChevronUp,
  UserRoundCheck,
  ShoppingCart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Carrito from "../pages/carrito/Carrito";
import Modal from "../components/Modal";



const MainLayout = ({ children}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const idUsuario = userData.idUsuarios;

  // const fetchCarrito = () => {
  //   if (!idUsuario) return;
  
  //   axios
  //     .get(`http://127.0.0.1:8000/api/carrito/${idUsuario}`)
  //     .then((response) => {
  //       setCarrito(response.data);
  //       setCantidad(response.data.length);
  //       console.log("Productos en carrito:", response.data.length);
  //     })
  //     .catch((error) => {
  //       console.error("Error al obtener los productos del carrito:", error);
  //     });
  // };

  // useEffect(() => {
  //   fetchCarrito();
  // }, []);
  const hanleOut = () =>{

    localStorage.removeItem("token");
    localStorage.removeItem("User");
    alert("Cerranso seccion...")
    window.location.href = '/login';
  
  }
  

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categorias")
      .then((response) => {
        setCategorias(response.data)
      })
      .catch((error) => console.error("Error al cargar categorías:", error));
  }, []);

  return (
    <div>
      <div className="flex">
        <aside
          className={`fixed top-0 left-0 h-screen bg-blue-800 text-white p-5 flex flex-col justify-between transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-56"
          }`}
        >
          <div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="mb-6 flex items-center gap-2 justify-center p-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Menu size={24} />
              {!isCollapsed && <span className="text-lg font-medium">Menú</span>}
            </button>

            <ul className="space-y-3">


            <li>
              <Link
                onClick={() => setModalAbierto(true)}
                className="flex items-center gap-2.5 p-3 rounded-lg transition-all hover:bg-blue-700 active:bg-blue-600 text-base font-medium relative"
              >
                <ShoppingCart size={20} />
                {!isCollapsed && <span>Carrito </span>}

              </Link>
            </li>



              <li>
                <Link
                  to="/productos"
                  className="flex items-center gap-2.5 p-3 rounded-lg transition-all hover:bg-blue-700 active:bg-blue-600 text-base font-medium"
                >
                  <ShoppingBasket size={20} />
                  {!isCollapsed && <span>Productos</span>}
                </Link>
              </li>


              <li>
                <button
                  onClick={() => setIsCategoriasOpen(!isCategoriasOpen)}
                  className="flex items-center justify-between w-full p-3 rounded-lg transition-all hover:bg-blue-700 active:bg-blue-600 text-base font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <ChartBarStacked size={20} />
                    {!isCollapsed && <span>Categorías</span>}
                  </div>
                  {!isCollapsed &&
                    (isCategoriasOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </button>
                {isCategoriasOpen && !isCollapsed && (
                  <ul className="ml-8 mt-1 space-y-1 text-sm">
                  {categorias.map((cat) => (
                    <li
                      key={cat.idCategoria}
                      className="p-2 rounded hover:bg-blue-600 cursor-pointer"
                      onClick={() => navigate(`/categoria/${cat.idCategoria}`)}
                    >
                      {cat.Nombre}
                    </li>
                  ))}
                  </ul>
                )}
              </li>
            </ul>
          </div>

          <div className="mt-auto space-y-3">
            
            
          {/* Mostrar el nombre del usuario aquí */}
            {!isCollapsed && userData && (
              <div className="text-white text-center p-3 font-semibold">
              <div className="flex items-center justify-center gap-2">
                <UserRoundCheck size={20} />
                <span>{userData.Name}</span>
              </div>
            </div>
            )}

            <Link
              to="/configuracion"
              className="flex items-center gap-2.5 p-3 rounded-lg transition-all hover:bg-blue-700 active:bg-blue-600 text-base font-medium"
            >
              <Settings size={20} />
              {!isCollapsed && <span>Configuración</span>}
            </Link>

            <button
              onClick={hanleOut}
              className="flex items-center gap-2.5 p-3 rounded-lg transition-all hover:bg-red-600 active:bg-red-500 text-base font-medium w-full"
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </aside>

        <main
          className={`flex-1 p-5 bg-gray-100 min-h-screen transition-all duration-300 ${
            isCollapsed ? "ml-20" : "ml-56"
          }`}
        >
          <header className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-white text-center">E-commerce</h1>
          </header>
          <div className="bg-white shadow-lg rounded-lg mt-4">{children}</div>
        </main> 

        <Modal
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          title="Carrito de Productos"
        >
            <Carrito 
                onClose={() => setModalAbierto(false)}
            />
        </Modal>
      </div>

    </div>
  );
};

export default MainLayout;
