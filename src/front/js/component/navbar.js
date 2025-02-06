import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    let navigate = useNavigate();

    const handleLogout = () => {

        // We call the logout function from actions to remove the token.
        actions.logout();
        
        // We navigate to the home page
        window.location.href = "https://humble-space-enigma-pjjq5g77v4v63g75-3001.app.github.dev/";
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container d-flex justify-content-between">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">
                    User authentication project using Python, Flask, and React.js. 💣
                    </span>
                </Link>
                <div className="d-flex align-items-center">
                    <Link to="/" className="btn btn-link mr-3">
                    🏠
                    </Link>

                    {/* If the user is logged in, display the logout button */}
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