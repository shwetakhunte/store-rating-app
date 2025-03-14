const UpdatePassword = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handlePasswordUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://127.0.0.1:3002/api/update-password",
                { password },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Password updated successfully!");
        } catch (error) {
            setMessage("Failed to update password.");
        }
    };

    return (
        <div>
            <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handlePasswordUpdate}>Update Password</button>
            {message && <p>{message}</p>}
        </div>
    );
};
