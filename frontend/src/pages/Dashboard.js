import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UpdatePassword from "./UpdatePassword";
import StoreItem from "./StoreItem";

const Dashboard = () => {
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:3002/api/stores", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Stores data:", response.data);
                setStores(response.data);
            } catch (error) {
                console.error("Error fetching stores:", error);
            }
        };

        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
            fetchStores();
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark px-4">
                <a href="{#}" className="navbar-brand">Store Rating Dashboard</a>

                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </nav>

            <div className="container mt-4">
                <h2 className="text-center">Welcome, {user?.name}</h2>

                {/* Update Password Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4>Update Password</h4>
                        <UpdatePassword />
                    </div>
                </div>

                {/* Search Stores */}
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Stores by Name or Address"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Store Listings */}
                <h3>Registered Stores</h3>
                <div className="row">
                    {stores
                        .filter((store) =>
                            store.name.toLowerCase().includes(search.toLowerCase()) ||
                            store.address.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((store) => (
                            <div className="col-md-4 mb-3" key={store.id}>
                                <StoreItem store={store} userId={user.id} />
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
