import React from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setAuthorized(!!token);
        setChecking(false);
    }, []);

    if (checking) return <p>Cargando...</p>; // opcional

    return authorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
