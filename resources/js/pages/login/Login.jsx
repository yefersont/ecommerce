import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockKeyhole } from "lucide-react";
import Loader from "../../components/Loader";
import { set } from "react-hook-form";
const Login = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/productos");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                {
                    User: user,
                    Password: password,
                }
            );

            const { access_token, User: userData } = response.data;

            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("idUsuarios", userData.idUsuarios);
            localStorage.setItem("role", userData.RollSuario_idTp_Rol);

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${access_token}`;
            navigate("/productos");
        } catch (err) {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6 border border-gray-200"
                    >
                        {/* Logo ficticio tipo Amazon */}
                        <div className="text-3xl font-bold text-yellow-500 text-center tracking-wide">
                            <span className="text-black">E-e</span>commerce
                        </div>

                        <div className="space-y-1 text-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Iniciar sesión
                            </h2>
                            <p className="text-sm text-gray-500">
                                Bienvenido, por favor ingresa tus datos
                            </p>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-yellow-500">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Usuario"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    className="w-full outline-none text-sm text-gray-700 bg-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-yellow-500">
                                <LockKeyhole className="h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full outline-none text-sm text-gray-700 bg-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition shadow-sm"
                            >
                                Ingresar
                            </button>
                        </form>

                        <div className="text-xs text-gray-500 text-center pt-2 hover:underline cursor-pointer">
                            ¿Olvidaste tu contraseña?
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Login;
