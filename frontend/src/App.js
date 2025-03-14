// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StoreownerDashboard from "./pages/StoreownerDashboard";

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/register" element={<Register />} />

                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/store-owner-dashboard" element={<StoreownerDashboard />} />
                
            </Routes>
        </Router>
    );
}

export default App;
