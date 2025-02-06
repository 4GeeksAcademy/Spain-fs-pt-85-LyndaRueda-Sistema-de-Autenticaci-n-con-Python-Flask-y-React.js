import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    let navigate = useNavigate();

    const handleLogout = () => {
        // Llamamos a la función logout de actions para eliminar el token
        actions.logout();
        // Redirigimos al home usando window.location.href
        window.location.href = "https://humble-space-enigma-pjjq5g77v4v63g75-3001.app.github.dev/";
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container d-flex justify-content-between">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">
                        Sistema de Autenticación con Python, Flask y React.js
                    </span>
                </Link>
                <div className="d-flex align-items-center">
                    {/* Enlace a Home */}
                    <Link to="/" className="btn btn-link mr-3">
                        Back to Home
                    </Link>

                    {/* Si está logueado, mostrar el botón Logout */}
                    {store.auth ? (
                        <button onClick={handleLogout} className="btn btn-danger">
                            Logout
                        </button>
                    ) : null}
                </div>
            </div>
        </nav>
    );
};