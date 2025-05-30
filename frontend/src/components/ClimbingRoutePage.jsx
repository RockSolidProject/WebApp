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
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isClimbed, setIsClimbed] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState("");
    const [attempts, setAttempts] = useState("");
    const [userClimbed, setUserClimbed] = useState(null);
    const [averageGrade, setAverageGrade] = useState("No ratings yet.");
    const fileInputRef = useRef();

    const ropeGrades = [
        "3", "3+", "4a", "4b", "4c",
        "5a", "5b", "5c",
        "6a", "6a+", "6b", "6b+", "6c", "6c+",
        "7a", "7a+", "7b", "7b+", "7c", "7c+",
        "8a", "8a+", "8b", "8b+", "8c", "8c+",
        "9a", "9a+", "9b", "9b+", "9c", "9c+"
    ];
    const boulderGrades = [
        "3", "3+", "4", "4+", "5", "5+",
        "6A", "6A+", "6B", "6B+", "6C", "6C+",
        "7A", "7A+", "7B", "7B+", "7C", "7C+",
        "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"
    ];
    const urbanGrades = [
        "I", "II", "III", "IV", "IV+", "V", "V+", "VI", "VI+",
        "VII", "VII+", "VIII", "VIII+", "IX", "IX+", "X", "X+", "XI", "XI+"
    ];

    async function fetchAverageGrade(){
        try {
            const res = await fetch(`${backendUrl}/routeConnections/averageGrade/${id}`);
            if (!res.ok) return;
            const data = await res.json();
            setAverageGrade(data.average)
        } catch (err) {
            setError('Error fetching climbed.');
        }
    }

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
        async function fetchUserClimbed() {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`${backendUrl}/routeConnections/climbed`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                const climbed = data.find(rc => rc.climbingRoute?._id === id);
                if (climbed) setUserClimbed(climbed);
            } catch (err) {
                setError('Error fetching climbed.');
            }
        }

        fetchRoute();
        fetchRatings();
        fetchComments();
        fetchUserClimbed();
        fetchAverageGrade();
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

            const ratingsRes = await fetch(`${backendUrl}/routeConnections/rating/${id}`);
            if (ratingsRes.ok) {
                const ratingsData = await ratingsRes.json();
                if (ratingsData.length > 0) {
                    const avg = ratingsData.reduce((acc, r) => acc + r.rating, 0) / ratingsData.length;
                    setAverageRating(avg);
                } else {
                    setAverageRating(0);
                }
            }
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

    async function handleMarkClimbed() {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        if (!selectedGrade || !attempts) {
            setError("Please select a grade and enter the number of attempts.");
            return;
        }
        try {
            const res = await fetch(`${backendUrl}/routeConnections/climbed/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    gradeOpinion: selectedGrade,
                    attempts: Number(attempts)
                })
            });
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Failed to mark as climbed.");
                return;
            }
            const climbedRes = await fetch(`${backendUrl}/routeConnections/climbed`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (climbedRes.ok) {
                const climbedData = await climbedRes.json();
                const climbed = climbedData.find(rc => rc.climbingRoute?._id === id);
                if (climbed) setUserClimbed(climbed);
            }
            setIsClimbed(false);
            setError("");
            fetchAverageGrade();
        } catch (err) {
            setError("Error marking as climbed.");
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
                <br />
            </div>

            {userClimbed ? (
                <div style={{margin: "16px 0", color: "#2d7a4a"}}>
                    <strong>You have already climbed this route.</strong><br />
                    Attempts: {userClimbed.attempts}<br />
                    Your grade: {userClimbed.gradeOpinion}
                </div>
            ) : isClimbed ? (
                <>
                    <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                    >
                        {(route.type === "boulder" ? boulderGrades : route.type === "lead" ? ropeGrades
                                : route.type === "urban" ? urbanGrades : []
                        ).map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min="1"
                        placeholder="Number of attempts"
                        value={attempts}
                        onChange={e => setAttempts(e.target.value)}
                        style={{ marginLeft: 8, width: 120 }}
                    />
                    <button
                        style={{ marginLeft: 8 }}
                        onClick={() => {handleMarkClimbed();}}
                    >
                        Submit
                    </button>
                </>
            ) : (
                <button onClick={() => setIsClimbed(true)}>
                    Mark as Climbed
                </button>
            )}
            <div style={{ margin: "16px 0" }}></div>
            <span>Average grade: {averageGrade}</span>
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