import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get("token");

                if (!token) {
                    alert("No se recibió token de Google");
                    return navigate("/login");
                }

                // Establecer token para futuras peticiones
                localStorage.setItem("token", token);
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;

                // Obtener datos del usuario desde el backend
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/user"
                );

                const userData = response.data;

                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("idUsuarios", userData.idUsuarios);
                localStorage.setItem("role", userData.RollSuario_idTp_Rol);

                navigate("/productos");
            } catch (error) {
                console.error("Error al iniciar sesión con Google:", error);
                alert("Error al procesar respuesta de Google");
                navigate("/login");
            }
        };

        authenticate();
    }, [navigate]);

    return (
        <p className="text-center mt-10 text-gray-700">
            Autenticando con Google...
        </p>
    );
};

export default GoogleCallback;
