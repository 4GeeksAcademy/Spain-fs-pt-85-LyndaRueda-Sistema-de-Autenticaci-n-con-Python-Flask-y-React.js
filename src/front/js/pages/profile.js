import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        // Solo llamamos a getProfile si el usuario aún no está en la store
        if (!store.user) {
            actions.getProfile()
                .then(() => {
                    setLoading(false);  // Una vez se carguen los datos, quitamos el loading
                })
                .catch(() => {
                    setLoading(false);  // Si hay un error, también quitamos el loading
                });
        } else {
            setLoading(false); // Si ya hay un usuario, dejamos de cargar
        }
    }, [actions, store.user]); // Dependemos de store.user para evitar el bucle

    return (
        <div className="text-center mt-5">
            <h1>Profile</h1>

            {loading ? (
                <p>Loading your profile...</p> // Si está cargando, mostramos este mensaje
            ) : store.user && store.user.logged_in_as ? (
                <h2>Welcome back, {store.user.logged_in_as}!</h2> // Accedemos a logged_in_as
            ) : (
                <p>No user found or error loading profile</p> // Si no se encontraron datos del usuario
            )}
        </div>
    );
};
