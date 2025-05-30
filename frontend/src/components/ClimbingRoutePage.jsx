import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import CustomRating from './Rating';
import Comments from "./Comments.jsx";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ClimbingRoutePage() {
    const { id } = useParams();
    const [route, setRoute] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [error, setError] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();

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
                setError('Error fetching route.' + err);
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
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    const myRating = data.find(r => String(r.postedBy?._id) === String(user.id));
                    setUserRating(myRating ? myRating.rating : 0);
                }
            } catch (err) {
                setError('Error fetching ratings for route.' + err);
            }
        }
        async function fetchComments() {
            try {
                const res = await fetch(`${backendUrl}/routeConnections/comment/${id}`);
                if(!res.ok) {
                    setError('Failed to fetch comments.');
                    return;
                }
                const data = await res.json();
                setComments(data);
            } catch (err) {
                setError('Error fetching comments.');
            }
        }
        fetchRoute();
        fetchRatings();
        fetchComments();
    }, [id]);

    useEffect(() => {
        if (ratings.length > 0) {
            const sum = ratings.reduce((sum, r) => sum + Number(r.rating || 0), 0);
            setAverageRating(sum / ratings.length);
        } else {
            setAverageRating(0);
        }
    }, [ratings]);

    const handleRating = async (value) => {
        setUserRating(value);
        try {
            const res = await fetch(`${backendUrl}/routeConnections/rating/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ rating: value })
            });
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                setError("")
                navigate("/login")
                return
            }
            if (!res.ok) {
                setError("Failed to submit rating.");
                return;
            }
            const ratingsRes = await fetch(`${backendUrl}/routeConnections/rating/${id}`);
            if (!ratingsRes.ok) {
                setError("Failed to fetch ratings.");
                return;
            }
            const ratingsData = await ratingsRes.json();
            setRatings(ratingsData);
            setUserRating(value);
        } catch (err) {
            setError("Error submitting rating: " + err);
        }
    };
    const handleCommentSubmit = async (comment) => {
        comment.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to comment.");
            return;
        }
        try {
            const res = await fetch(`${backendUrl}/routeConnections/comment/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ content: newComment })
            });
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setError("");
                navigate("/login");
                return;
            }
            if (!res.ok) {
                setError("Failed to submit comment.");
                return;
            }
            setNewComment("");
            const commentsRes = await fetch(`${backendUrl}/routeConnections/comment/${id}`);
            if (!commentsRes.ok) {
                setError("Failed to fetch comments.");
                return;
            }
            const commentsData = await commentsRes.json();
            setComments(commentsData);
        } catch (err) {
            setError("Error submitting comment: " + err);
        }
    };

    if (error) return <div>{error}</div>;
    if (!route) return <div>Loading...</div>;


    const sortedComments = [...comments].sort(
        (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
    );

    return (
        <div>
            <h2>{route.name}</h2>
            <div><strong>Posted by:</strong> {route.postedBy?.username || 'Unknown'}</div>
            <div><strong>Type:</strong> {route.type}</div>
            <div>
                <strong>Rating:</strong> {averageRating}
                <br />
                <span>
                    Your rating:
                </span>
                <br />
                <CustomRating
                    value={userRating}
                    onChange={handleRating}
                    readonly={!localStorage.getItem("token")}
                />
                <br />
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        name="comment"
                        id="comment"
                        cols="30"
                        rows="10"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                    ></textarea>
                    <br />
                    <button type="submit">Submit</button>
                </form>
                {sortedComments && sortedComments.length > 0 ? (
                    <Comments comments={sortedComments} />
                ) : (
                    <p className="climbing-area-info" style={{color: '#888'}}>No comments available.</p>
                )}

            </div>
        </div>
    );
}