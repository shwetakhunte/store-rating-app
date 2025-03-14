import React, { useState } from "react";
import axios from "axios";

const StoreItem = ({ store, userId }) => {
    const [rating, setRating] = useState(store.user_rating || "");
    const [overallRating, setOverallRating] = useState(store.overall_rating || "Not rated yet");

    const handleRatingSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://127.0.0.1:3002/api/ratings",
                { store_id: store.id, user_id: userId, rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOverallRating(response.data.newOverallRating);
            alert("Rating submitted successfully!");
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{store.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{store.address}</h6>
                <p className="card-text">
                    <strong>Overall Rating:</strong> {overallRating ? Number(overallRating).toFixed(1) : "Not rated yet"}
                </p>

                {/* Rating Input */}
                <select className="form-select mb-2" value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="">Select Rating</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num} Star</option>
                    ))}
                </select>

                <button className="btn btn-primary" onClick={handleRatingSubmit} disabled={!rating}>
                    {store.user_rating ? "Update Rating" : "Submit Rating"}
                </button>
            </div>
        </div>
    );
};

export default StoreItem;
