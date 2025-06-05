import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    List,
    ListItem,
    Divider,
    Tooltip,
} from '@mui/material';
import ShowLocationOnMap from './ShowLocationOnMap.jsx';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ClimbingAreaPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [area, setArea] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState('');
    const [bookmarks, setBookmarks] = useState({});
    const [climbed, setClimbed] = useState({});

    useEffect(() => {
        async function fetchArea() {
            try {
                const res = await fetch(`${backendUrl}/climbingAreas/${id}`);
                if (!res.ok) {
                    setError('Napaka pri pridobivanju plezališča.');
                    return;
                }
                const data = await res.json();
                setArea(data);
            } catch (err) {
                setError('Napaka pri pridobivanju plezališča.');
            }
        }

        async function fetchRoutesAndData() {
            try {
                const res = await fetch(`${backendUrl}/climbingRoutes/byArea/${id}`);
                if (!res.ok) return;
                const data = await res.json();
                setRoutes(data);
                const token = localStorage.getItem("token");

                if (token) {
                    const res = await fetch(`${backendUrl}/routeConnections/wishlist`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const wishlist = await res.json();
                        const ids = wishlist.map(w =>
                            (w.climbingRoute && w.climbingRoute._id) || w.climbingRoute || w._id
                        );
                        const bm = {};
                        data.forEach(route => {
                            bm[route._id] = ids.includes(route._id);
                        });
                        setBookmarks(bm);
                    }
                }
                if (token) {
                    const res = await fetch(`${backendUrl}/routeConnections/climbed`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (!res.ok) {
                        setError('Napaka pri pridobivanju plezališča.');
                        return;
                    }
                    const data = await res.json();
                    setClimbed(
                    Array.isArray(data)
                        ? data.reduce((acc, item) => {
                            const routeId = item.climbingRoute?._id || item.climbingRoute || item._id;
                            if (routeId) acc[routeId] = true;
                            return acc;
                        }, {}) : {}
                    );
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchArea();
        fetchRoutesAndData();
    }, [id]);

    async function toggleBookmark(routeId) {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const res = await fetch(`${backendUrl}/routeConnections/wishlist/${routeId}`, {
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
            if (!res.ok) return;
            setBookmarks(prev => ({
                ...prev,
                [routeId]: !prev[routeId]
            }));
        } catch (err) {
            console.error("Napaka pri togglanju zaznamka:", err);
        }
    }

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

    if (error) return <Typography color="error">{error}</Typography>;
    if (!area) return <Typography>Loading...</Typography>;

    return (
        <Box maxWidth={700} mx="auto" mt={4}>
            <Card>
                <CardContent>
                    <Typography variant="h4" fontWeight="500" color="primary">{area.name}</Typography>
                    <Typography variant="body1" mt={3} mb={2}><strong>Objavil:</strong> {area.postedBy?.username || 'Unknown'}</Typography>
                    <ShowLocationOnMap latitude={area.latitude} longitude={area.longitude} />
                    <Typography variant="h6" mt={3} mb={2}>Plezalne poti</Typography>
                    <List>
                        {routes.map((route, idx) => (
                            <React.Fragment key={route._id}>
                                <ListItem
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {climbed[route._id] && (
                                                <Tooltip title="Splezano">
                                                    <CheckCircleIcon sx={{ color: "#49b02d" }} />
                                                </Tooltip>
                                            )}
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleBookmark(route._id);
                                                }}
                                                sx={{
                                                    color: bookmarks[route._id] ? "#FFD600" : "inherit"
                                                }}
                                            >
                                                {bookmarks[route._id] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                            </IconButton>
                                        </Box>
                                    }
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/climbingRoutes/${route._id}`)}
                                >
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {route.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Težavnost: {route.averageGrade || "-"} &nbsp;|&nbsp; Dolžina: {route.length}m &nbsp;|&nbsp; Tip: {translateRouteType(route.type) || "-"} &nbsp;|&nbsp; Ocena: {route.averageRating != null ? route.averageRating.toFixed(1) + " ★" : "Ni ocen"}
                                        </Typography>
                                    </Box>
                                </ListItem>
                                {idx < routes.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                        {routes.length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Ni dodanih poti.
                            </Typography>
                        )}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ClimbingAreaPage;
