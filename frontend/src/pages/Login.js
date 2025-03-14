import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError("");
//         try {
//             const response = await axios.post("http://127.0.0.1:3002/api/login", { email, password });
//                 console.log("Response:", response.data); // Debugging

//                 const { token, user } = response.data; 
//                 localStorage.setItem("token", token);
//                 localStorage.setItem("user", JSON.stringify(user));

                

//             // Extract token and user from the response
//            // const { token, user } = response.data; 

//             //localStorage.setItem("token", response.data.token);
//             //localStorage.setItem("user", JSON.stringify(response.data.user));

// //            localStorage.setItem("token", token);
//   //          localStorage.setItem("user", JSON.stringify(user));

//             // Redirect based on role
//         if (user.role === "admin") {
//             navigate("/admin"); // Redirect admins
//         } else {
//             navigate("/dashboard"); // Redirect normal users
//         }
//         //navigate("/dashboard");
//         } catch (err) {
//             setError("Invalid email or password.");
//         }
//     };


const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:3002/api";
        const response = await axios.post(`${API_URL}/login`, { email, password });

        console.log("Login response:", response.data); // Debugging

        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ id: user.id, name: user.name, role: user.role }));

        console.log("User role:", user.role);

        switch (user.role) {
            case "admin":
                navigate("/admindashboard");
                break;
            case "store_owner":
                console.log("Redirecting to Store Owner Dashboard...");
                navigate("/store-owner-dashboard");  // Ensure this route exists
                break;
            default:
                navigate("/dashboard");
        }
    } catch (err) {
        console.error("Login Error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Invalid email or password.");
    }
};



    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>

                <p className="text-center mt-3">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
