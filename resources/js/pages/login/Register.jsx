import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UserIcon, LockKeyhole, BadgePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState("");
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const Rol = 2;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (pass !== confirmPass) {
            setError("Las contraseñas no coinciden");
            return;
        }
        axios
            .post(`http://127.0.0.1:8000/api/register`, {
                Name: name,
                RollSuario_idTp_Rol: Rol,
                User: user,
                Password: pass,
            })
            .then(() => {
                console.log("Usuario registrado correctamente");
                alert("Te registraste correctamente, ahora inicia seccion");
                navigate("/login");
            })
            .catch((err) => {
                console.error("Error: ", err);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6 border border-gray-200"
            >
                <div className="text-3xl font-bold text-yellow-500 text-center tracking-wide">
                    <span className="text-black">E-e</span>commerce
                </div>

                <div className="space-y-1 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Crear cuenta
                    </h2>
                    <p className="text-sm text-gray-500">
                        Regístrate para empezar a comprar
                    </p>
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                {success && (
                    <p className="text-green-600 text-sm text-center">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-yellow-500">
                        <BadgePlus className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full outline-none text-sm text-gray-700 bg-transparent"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-yellow-500">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            className="w-full outline-none text-sm text-gray-700 bg-transparent"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-yellow-500">
                        <LockKeyhole className="h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full outline-none text-sm text-gray-700 bg-transparent"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-yellow-500">
                        <LockKeyhole className="h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="w-full outline-none text-sm text-gray-700 bg-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition shadow-sm"
                    >
                        Registrarse
                    </button>
                </form>

                <div
                    className="text-xs text-gray-500 text-center pt-2 hover:underline cursor-pointer"
                    onClick={() => navigate("/login")}
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
