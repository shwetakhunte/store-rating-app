import React, { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (name.length < 3 || name.length > 60) {
            setError("Name must be between 3 and 60 characters.");
            return;
        }
        if (address.length > 400) {
            setError("Address cannot exceed 400 characters.");
            return;
        }
        if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,16}$/.test(password)) {
            setError("Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }

        try {
            await signup({ name, email, password, address, role: "user" });
            alert("Registration successful! Please login.");
            navigate("/");
        } catch (error) {
            setError(error.message || "Registration failed. Email might be already in use.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Register</h2>
                
                {error && <p className="text-danger">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            placeholder="Name" 
                            value={name} 
                            className="form-control" 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            className="form-control" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            className="form-control" 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea 
                            placeholder="Address" 
                            value={address} 
                            className="form-control" 
                            onChange={(e) => setAddress(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
