import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdatePassword from "./UpdatePassword";

const StoreownerDashboard = () => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [store, setStore] = useState({ name: "" });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // Assuming user ID is stored here
        const user_id = user?.id; // Get the logged-in user's ID

        if (!token || !user_id) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:3002/api/store-owner/dashboard?user_id=${user_id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log("API Response Status:", response.status);
            if (!response.ok) throw new Error("Failed to fetch dashboard data");
            return response.json();
        })
        .then(data => {
            console.log("Fetched Data:", data);
            setStore({ name: data.storeName });
            setRatings(data.ratings);
            setAverageRating(data.averageRating);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setLoading(false);
        });
    },); // Empty dependency array to run only once

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="container-fluid bg-light min-vh-100">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark px-4">
                <a className="navbar-brand" href="{#}">Store Owner Dashboard</a>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </nav>

            <div className="container mt-4">
                <div className="row">
                    <h2 className="text-center">Welcome, {store.name}</h2>
                    <div className="col-md-4">
                        <div className="card shadow p-3 text-center">
                            <h4>Update Password</h4>
                            <UpdatePassword />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow p-3 text-center">
                            <h4>Average Rating</h4>
                            <h2 className="text-success">{Number(averageRating).toFixed(1)}</h2>

                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h4>Ratings Received</h4>
                    {loading ? (
                        <p>Loading ratings...</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ratings.length > 0 ? (
                                        ratings.map((r, index) => (
                                            <tr key={index}>
                                                <td>{r.user_name}</td>
                                                <td>{r.user_email}</td>
                                                <td>{Number(r.rating).toFixed(1)}</td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">No ratings yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreownerDashboard;
