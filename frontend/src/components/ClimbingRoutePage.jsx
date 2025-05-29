import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomRating from './Rating';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ClimbingRoutePage() {
    const { id } = useParams();
    const [route, setRoute] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [error, setError] = useState('');
    const [userRating, setUserRating] = useState(0);

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
        fetchRoute();
        fetchRatings();
    }, [id]);

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

    useEffect(() => {
        if (ratings.length > 0) {
            const sum = ratings.reduce((sum, r) => sum + Number(r.rating || 0), 0);
            setAverageRating(sum / ratings.length);
        } else {
            setAverageRating(0);
        }
    }, [ratings]);

    if (error) return <div>{error}</div>;
    if (!route) return <div>Loading...</div>;

    return (
        <div>
            <h2>{route.name}</h2>
            <div><strong>Type:</strong> {route.type}</div>
            <div>
                <strong>Rating:</strong> {averageRating}
                <br />
                <CustomRating
                    value={userRating}
                    onChange={handleRating}
                    readonly={!localStorage.getItem("token")}
                />
                <br />
                <span>
                    {userRating ? `Your rating: ${userRating}` : ""}
                </span>
            </div>
            <div><strong>Posted by:</strong> {route.postedBy?.username || 'Unknown'}</div>
        </div>
    );
}