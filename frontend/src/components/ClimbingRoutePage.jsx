import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Rating from '@mui/material/Rating';
import Comments from "./Comments.jsx";
import AnimatedGradesChart from './AnimatedGradesChart.jsx';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

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
    const [averageGrade, setAverageGrade] = useState("Ni še ocen.");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [chartKey, setChartKey] = useState(0); // Add this line
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

    function translateRouteType(type) {
        switch (type) {
            case "lead":
                return "Športna pot";
            case "boulder":
                return "Balvan";
            case "urban":
                return "Urbana pot";
            default:
                return type;
        }
    }

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
        async function checkWishlist() {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`${backendUrl}/routeConnections/wishlist`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();

                const isInWishlist = data.some(wishlistItem =>
                    (wishlistItem._id === id) ||
                    (wishlistItem.climbingRoute && wishlistItem.climbingRoute._id === id) ||
                    (wishlistItem.climbingRoute === id)
                );

                setIsBookmarked(isInWishlist);
            } catch (err) {
                console.error('Error checking wishlist:', err);
            }
        }
        fetchRoute();
        fetchRatings();
        fetchComments();
        fetchUserClimbed();
        fetchAverageGrade();
        checkWishlist();
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
            setChartKey(prev => prev + 1);
        } catch (err) {
            setError("Error marking as climbed.");
        }
    }

    async function toggleBookmark() {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/routeConnections/wishlist/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            if (!res.ok) {
                setError("Failed to update wishlist.");
                return;
            }

            setIsBookmarked(!isBookmarked);
        } catch (err) {
            setError("Error updating wishlist.");
        }
    }

    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!route) return <div>Loading...</div>;

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ minWidth: 350, maxWidth: 800, width: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h4" fontWeight="500" color="primary">{route.name}</Typography>
                        <Tooltip title={isBookmarked ? "Odstrani iz seznama želja" : "Dodaj na seznam želja"}>
                            <IconButton onClick={toggleBookmark} color={isBookmarked ? "primary" : "default"}>
                                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography variant="body1"><strong>Dolžina:</strong> {route.length} m</Typography>
                    <Typography variant="body1"><strong>Tip:</strong> {translateRouteType(route.type)}</Typography>
                    <Typography variant="body1"><strong>Objavil:</strong> {route.postedBy?.username || "Unknown"}</Typography>
                    <Typography variant="body1"><strong>Zunanje Plezališče:</strong> {route.climbingArea?.name || "Unknown"}</Typography>
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
                                onClick={(e) => {
                                    const newValue = parseInt(e.target.getAttribute('data-value') || 0, 10);
                                    if (newValue === userRating) {
                                        handleRatingChange(newValue);
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
                    {userClimbed ? (
                        <Box my={2} color="success.main">
                            <Typography variant="body1"><strong>To pot ste že splezali.</strong></Typography>
                            <Typography variant="body2">Število poskusov:{userClimbed.attempts}</Typography>
                            <Typography variant="body2">Vaša ocena: {userClimbed.gradeOpinion}</Typography>
                        </Box>
                    ) : isClimbed ? (
                        <Box display="flex" alignItems="center" gap={2} my={2}>
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Težavnost</InputLabel>
                                <Select
                                    value={selectedGrade}
                                    label="Grade"
                                    onChange={e => setSelectedGrade(e.target.value)}
                                    required={true}
                                >
                                    {(route.type === "boulder" ? boulderGrades : route.type === "lead" ? ropeGrades
                                            : route.type === "urban" ? urbanGrades : []
                                    ).map((option, index) => (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                type="number"
                                label="Attempts"
                                value={attempts}
                                onChange={e => setAttempts(e.target.value)}
                                inputProps={{ min: 1 }}
                                sx={{ width: 120 }}
                                required={ true }
                            />
                            <Button
                                variant="contained"
                                onClick={handleMarkClimbed}
                            >
                                Submit
                            </Button>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => setIsClimbed(true)}
                            sx={{ my: 2 }}
                        >
                            Označi kot splezano
                        </Button>
                    )}
                    <Typography variant="body2" sx={{ mt: 2 }}>Povprečna težavnost: {averageGrade}</Typography>
                    <AnimatedGradesChart routeId={id} key={chartKey} />
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