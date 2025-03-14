import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "user" });
    const [newStore, setNewStore] = useState({ name: "", address: "", owner_id: "" });

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resStats = await axios.get("http://127.0.0.1:3002/api/admin/dashboard");
                const resUsers = await axios.get("http://127.0.0.1:3002/api/admin/users");
                const resStores = await axios.get("http://127.0.0.1:3002/api/admin/stores");
    
                console.log("Stats:", resStats.data);
                console.log("Users:", resUsers.data);
                console.log("Stores:", resStores.data);
    
                setStats(prev => ({ ...prev, ...resStats.data.data }));
                setUsers([...resUsers.data]);
                setStores([...resStores.data]);
            } catch (error) {
                console.error("Error:", error);
            }
        };
    
        fetchData();
    }, [navigate]);
    

    const handleAddUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            await axios.post("http://127.0.0.1:3002/api/admin/add-user", newUser, { headers });
            alert("User added successfully!");
            setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Failed to add user.");
        }
    };

    const handleAddStore = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            await axios.post("http://127.0.0.1:3002/api/admin/add-store", newStore, { headers });
            alert("Store added successfully!");
            setNewStore({ name: "", address: "", owner_id: "" });
        } catch (error) {
            console.error("Error adding store:", error);
            alert("Failed to add store.");
        }
    };

    const filteredUsers = users.filter(user =>
        Object.values(user).some(value =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredStores = stores.filter(store =>
        Object.values(store).some(value =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
<>
        <nav className="navbar navbar-dark bg-dark px-4">
                <a href="{#}" className="navbar-brand">Store Rating Dashboard</a>

                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </nav>
        <div className="container mt-4">
            <h2 className="text-center">Welcome Admin </h2>

            {/* Dashboard Stats */}
            <div className="row">
                <div className="col-md-4"><div className="card p-3">Total Users: {stats.total_users}</div></div>
                <div className="col-md-4"><div className="card p-3">Total Stores: {stats.total_stores}</div></div>
                <div className="col-md-4"><div className="card p-3">Total Ratings: {stats.total_ratings}</div></div>
            </div>

            {/* Search Box */}
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Search by Name, Email, Address, Role..."
                    className="form-control"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Add User */}
            <div className="card mt-4">
                <div className="card-header">Add User</div>
                <div className="card-body">
                    <input type="text" placeholder="Name" className="form-control mb-2" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                    <input type="email" placeholder="Email" className="form-control mb-2" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                    <input type="password" placeholder="Password" className="form-control mb-2" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                    <input type="text" placeholder="Address" className="form-control mb-2" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} />
                    <select className="form-select mb-2" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="store_owner">Store Admin</option>
                    </select>
                    <button className="btn btn-primary" onClick={handleAddUser}>Add User</button>
                </div>
            </div>

            {/* Add Store */}
            <div className="card mt-4">
                <div className="card-header">Add Store</div>
                <div className="card-body">
                    <input type="text" placeholder="Store Name" className="form-control mb-2" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
                    <input type="text" placeholder="Address" className="form-control mb-2" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} />
                    <select className="form-select mb-2" value={newStore.owner_id} onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })}>
                        <option value="">Select Store Owner</option>
                        {users.filter(user => user.role === "user").map(user => (
                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                        ))}
                    </select>
                    <button className="btn btn-success" onClick={handleAddStore}>Add Store</button>
                </div>
            </div>

            {/* List of Users */}
            <div className="mt-4">
                <h4>All Users</h4>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Rating (If Store Owner)</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>{user.role}</td>
                           
                            <td>
                                {user.role === "user"
                                    ? (user.rating !== null && user.rating !== undefined 
                                        ? parseFloat(user.rating).toFixed(1)  // Format to 2 decimal places
                                        : "No Ratings")
                                    : "N/A"}
                            </td>

                        </tr>
                    ))}

                    </tbody>

                </table>
            </div>


            <div className="mt-4">
                <h4>All stores</h4>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            
                            <th>Name</th>
                            <th>Address</th>
                            <th>Rating (If Store Owner)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStores.map(store => (
                            <tr key={store.id}>
                                <td>{store.name}</td>
                                <td>{store.address}</td>
                                <td>{store.overall_rating ? parseFloat(store.overall_rating).toFixed(1) : "No Ratings"}</td>
                            </tr>
                        ))}
                    </tbody>


                </table>
            </div>

        </div>

        </>
    );
};

export default AdminDashboard;
