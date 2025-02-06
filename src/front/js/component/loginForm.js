import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { store, actions } = useContext(Context);
    let navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        let logged = await actions.login(email, password);
        if (logged) {
            navigate("/profile");
        }
    }

    return (
        <div className="mx-auto w-50">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address 📧</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />

                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password 🔑</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>

                {store.errorMessage && (
                    <div className="alert alert-danger mt-3">
                        {store.errorMessage}
                    </div>
                )}
            </form>

            <div className="mt-3 text-center">
                <p>If you want an account... sign up here.👉 <Link to="/signup">Register here</Link>.</p>
            </div>
        </div>
    );
};