import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, TextField, Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import Comments from "./Comments.jsx";
import ShowLocationOnMap from './ShowLocationOnMap.jsx';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ClimbingCenterPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [center, setCenter] = useState(null);
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        async function fetchCenter() {
            try {
                const res = await fetch(`${backendUrl}/climbingCenter/${id}`);
                if (!res.ok) {
                    setError('Failed to fetch climbing center.');
                    return;
                }
                const data = await res.json();
                setCenter(data);
            } catch (err) {
                setError('Error fetching climbing center.');
            }
        }

        async function fetchRatings() {
            try {
                const res = await fetch(`${backendUrl}/centerConnections/rating/${id}`);
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
                const res = await fetch(`${backendUrl}/centerConnections/comment/${id}`);
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

        fetchCenter();
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
            const res = await fetch(`${backendUrl}/centerConnections/rating/${id}`, {
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

        const ratingsRes = await fetch(`${backendUrl}/centerConnections/rating/${id}`);
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
            const res = await fetch(`${backendUrl}/centerConnections/comment/${id}`, {
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
    if (!center) return <div>Loading...</div>;

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ minWidth: 350, maxWidth: 800, width: '100%' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{center.name}</Typography>

                    <Box mt={2}>
                        <Typography variant="body1"><strong>Lastnik:</strong> {center.owner?.username || "Unknown"}</Typography>
                    </Box>

                    <Box mt={2}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Lastnosti</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                mt: 1,
                                background: '#f5f7fa',
                                borderRadius: 2,
                                p: 1,
                                boxShadow: 1,
                            }}
                        >
                            {center.hasBoulders && <Box sx={{ bgcolor: 'rgba(25,118,210,0.9)', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontWeight: 500 }}>Bolderji</Box>}
                            {center.hasRoutes && <Box sx={{ bgcolor: 'rgba(56,142,60,0.9)', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontWeight: 500 }}>Športne poti</Box>}
                            {center.hasMoonboard && <Box sx={{ bgcolor: 'rgba(251,192,45,0.9)', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontWeight: 500 }}>Moonboard</Box>}
                            {center.hasSprayWall && <Box sx={{ bgcolor: 'rgba(142,36,170,0.9)', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontWeight: 500 }}>Šutalnica</Box>}
                            {center.hasKilter && <Box sx={{ bgcolor: 'rgba(0,151,167,0.9)', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontWeight: 500 }}>Kilter</Box>}
                        </Box>
                    </Box>

                    <Box my={3}>
                        <ShowLocationOnMap latitude={center.latitude} longitude={center.longitude} />
                    </Box>

                    <Box mt={2} mb={2}>
                        <Typography variant="body1"><strong>Povprečna ocena:</strong> {averageRating ? averageRating.toFixed(2) : "Ni še ocen"}</Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Rating
                                value={userRating}
                                onChange={(_, value) => {
                                    if (value !== null) {
                                        handleRatingChange(value);
                                    }
                                }}
                                readOnly={!localStorage.getItem("token")}
                            />
                            {userRating ? (
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                    (Vaša ocena: {userRating})
                                </Typography>
                            ) : null}
                        </Box>
                    </Box>

                    <Typography variant="h6" sx={{ mt: 4 }}>Dodaj komentar</Typography>
                    <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
                        <TextField
                            multiline
                            minRows={3}
                            fullWidth
                            label="Napišite komentar..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />
                        {imagePreview && (
                            <Box>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ maxWidth: 200, borderRadius: 8 }}
                                />
                            </Box>
                        )}
                        <Box display="flex" alignItems="center" gap={2}>
                            <Button
                                variant="outlined"
                                component="span"
                                onClick={() => fileInputRef.current.click()}
                            >
                                Priloži sliko
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />

                        </Box>
                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Dodaj komentar</Button>
                    </Box>

                    <Typography variant="h6">Komentarji</Typography>
                    <Comments comments={comments} />
                </CardContent>
            </Card>
        </Box>
    );
}