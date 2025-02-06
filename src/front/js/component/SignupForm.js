import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
    let navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const userData = { email, password };

        try {
            const response = await fetch("https://humble-space-enigma-pjjq5g77v4v63g75-3001.app.github.dev/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.status === 201) {
                // Registro exitoso
                // Eliminar token si existe
                localStorage.removeItem("token");

                // Establecer el mensaje de éxito
                setSuccessMessage("Register successful! Please login now.");

                // Redirigir al home después de 3 segundos
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                // Mostrar mensaje de error
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage("Hubo un error al registrar el usuario.");
        }
    }

    return (
        <div className="mx-auto w-50">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="d-flex justify-content-between mt-3">
                    <button type="submit" className="btn btn-primary w-45">Register</button>
                    <button 
                        type="button" 
                        className="btn btn-secondary w-45" 
                        onClick={() => navigate("/home")}
                    >
                        Cancel
                    </button>
                </div>

                {/* Mostrar mensaje de error si existe */}
                {errorMessage && (
                    <div className="alert alert-danger mt-3">
                        {errorMessage}
                    </div>
                )}

                {/* Mostrar mensaje de éxito si existe */}
                {successMessage && (
                    <div className="alert alert-success mt-3">
                        {successMessage}
                    </div>
                )}
            </form>
        </div>
    );
};