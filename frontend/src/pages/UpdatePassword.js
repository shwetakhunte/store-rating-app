import React, { useState } from "react";
import axios from "axios";

const UpdatePassword = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handlePasswordUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                setMessage("Authentication error. Please log in again.");
                return;
            }
    
            console.log("🔍 Token before request:", token); // Debugging
    
            const response = await axios.post(
                "http://127.0.0.1:3002/api/update-password",
                { password },
                {
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            setMessage(response.data.message);
            setPassword("");
        } catch (error) {
            console.error("❌ Update Password Error:", error);
            console.error("📢 Server Response:", error.response?.data);
            setMessage(error.response?.data?.error || "Failed to update password.");
        }
    };
    
    
    

    return (
        <div className="p-3">
            <input
                type="password"
                placeholder="New Password"
                value={password}
                className="form-control mb-4"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handlePasswordUpdate} className="btn btn-primary w-50">Update Password</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdatePassword;
