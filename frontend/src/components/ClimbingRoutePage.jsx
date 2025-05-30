import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomRating from './Rating';
import Comments from "./Comments.jsx";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ClimbingRoutePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [route, setRoute] = useState(null);
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        async function fetchRoute() {
            try {
                const res = await fetch(`${backendUrl}/climbingRoutes/${id}`);
                if (!res.ok) {
                    setError('Failed to fetch route.');
                    return;
                }
                const data = await res.json();
                setRoute(data);
            } catch (err) {
                setError('Error fetching route.');
            }
        }
        async function fetchRatings() {
            try {
                const res = await fetch(`${backendUrl}/routeConnections/rating/${id}`);
                if (!res.ok) {
                    setError('Failed to fetch ratings.');
                    return;
                }
                const data = await res.json();
                setRatings(data);
                if (data.length > 0) {
                    const avg = data.reduce((acc, r) => acc + r.rating, 0) / data.length;
                    setAverageRating(avg);
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (user) {
                        const userR = data.find(r => r.postedBy?._id === user.id);
                        if (userR) setUserRating(userR.rating);
                    }
                } else {
                    setAverageRating(0);
                }
            } catch (err) {
                setError('Error fetching ratings.');
            }
        }
        async function fetchComments() {
            try {
                const res = await fetch(`${backendUrl}/routeConnections/comment/${id}`);
                if (!res.ok) {
                    setError('Failed to fetch comments.');
                    return;
                }
                const data = await res.json();
                setComments(
                    data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
                );
            } catch (err) {
                setError('Error fetching comments.');
            }
        }
        fetchRoute();
        fetchRatings();
        fetchComments();
    }, [id]);

    async function handleRatingChange(value) {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const res = await fetch(`${backendUrl}/routeConnections/rating/${id}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating: value })
            });
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }
            if (!res.ok) {
                setError("Failed to submit rating.");
                return;
            }
            setUserRating(value);
            const data = await res.json();
            setAverageRating(data.rating || data.averageRating || value);
        } catch (err) {
            setError("Error submitting rating.");
        }
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }

    async function handleAddComment(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        let imageBase64 = null;
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                imageBase64 = reader.result;
                await submitComment(imageBase64);
            };
            reader.readAsDataURL(imageFile);
        } else {
            await submitComment(null);
        }
    }

    async function submitComment(image) {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${backendUrl}/routeConnections/comment/${id}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: newComment,
                    image: image
                })
            });
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }
            if (!res.ok) {
                setError("Failed to add comment.");
                return;
            }
            setNewComment('');
            setImageFile(null);
            setImagePreview(null);
            const data = await res.json();
            setComments(prev => [data, ...prev]);
        } catch (err) {
            setError("Error adding comment.");
        }
    }

    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!route) return <div>Loading...</div>;

    return (
        <div className="climbing-area-card">
            <h2 className="climbing-area-title">{route.name}</h2>
            <div className="climbing-area-info"><strong>Length:</strong> {route.length} m</div>
            <div className="climbing-area-info"><strong>Type:</strong> {route.type}</div>
            <div className="climbing-area-info"><strong>Posted by:</strong> {route.postedBy?.username || "Unknown"}</div>
            <div className="climbing-area-info"><strong>Climbing Area:</strong> {route.climbingArea?.name || "Unknown"}</div>
            <div className="climbing-area-info" style={{ marginTop: 16 }}>
                <strong>Average Rating:</strong> {averageRating ? averageRating.toFixed(2) : "No ratings yet"}
            </div>
            <div style={{ margin: "8px 0" }}>
                <CustomRating
                    value={userRating}
                    onChange={handleRatingChange}
                    readonly={!localStorage.getItem("token")}
                />
                <br />
                <span style={{ marginLeft: 8 }}>{userRating ? `(Your rating: ${userRating})` : ""}</span>
            </div>
            <h3 style={{ marginTop: 32 }}>Add a Comment</h3>
            <form onSubmit={handleAddComment} style={{ marginBottom: 24 }}>
                <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    rows={3}
                    style={{ width: "100%", borderRadius: 8, padding: 8, fontSize: 16, marginBottom: 8 }}
                    required
                />
                <div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        style={{ marginRight: 8 }}
                    >
                        Add Image
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: 200, marginTop: 8, display: "block", borderRadius: 8 }}
                        />
                    )}
                </div>
                <button type="submit" style={{ marginTop: 8 }}>Add Comment</button>
            </form>
            <h3>Comments</h3>
            <Comments comments={comments} />
        </div>
    );
}