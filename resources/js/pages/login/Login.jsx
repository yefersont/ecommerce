import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockKeyhole } from 'lucide-react';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        User: user,
        Password: password,
      });
  
      const { access_token, User: userData } = response.data;
  
      // Almacna el token
      localStorage.setItem('token', access_token);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem("idUsuarios", userData.idUsuarios)
      
      localStorage.setItem("role", userData.RollSuario_idTp_Rol);
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
      console.log('Usuario logueado:', userData);
      
      navigate('/productos'); 
      
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };
  

  return (
    <div className="min-h-screen flex">
      {/* Sección de imagen o fondo */}
      
      <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url("")' }}></div>

      {/* Sección de formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 p-8">
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full space-y-8">
          <h2 className="text-4xl font-semibold text-center text-gray-800">Iniciar Sesión</h2>
          <p className="text-sm text-center text-gray-600">Accede a tu cuenta para continuar</p>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex items-center border-b-2 border-gray-300 py-2 px-3 rounded-xl focus-within:border-teal-500 transition-all">
              <UserIcon className="h-6 w-6 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Usuario"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center border-b-2 border-gray-300 py-2 px-3 rounded-xl focus-within:border-teal-500 transition-all">
              <LockKeyhole className="h-6 w-6 text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
