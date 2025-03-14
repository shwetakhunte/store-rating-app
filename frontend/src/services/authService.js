import axios from "axios";

const API_URL = "http://127.0.0.1:3002/api"; // Ensure correct URL

export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data;
    } catch (error) {
        console.error("Signup error:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};



export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData, {
            headers: { "Content-Type": "application/json" }
        });

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};