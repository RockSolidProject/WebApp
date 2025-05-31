import React, {useEffect, useState} from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Grid,
    Button,
    Link
} from "@mui/material";
import {Link as RouterLink, useNavigate} from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        async function getEvents() {
            try {
                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const res = await fetch(`${backendUrl}/events`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if(res.status ===403 || res.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }
                if (!res.ok) throw new Error("Failed to fetch events");

                const data = await res.json();
                setEvents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        getEvents();
    }, []);

    return (
        <Container maxWidth="md" sx={{mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Upcoming Events
            </Typography>

            {loading && <CircularProgress/>}

            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={2}>
                {events.map((event) => (
                    <Link
                        component={RouterLink}
                        to={`/event/${event._id}`}
                        key={event._id}
                        color="inherit"
                        variant="outlined"
                        underline="none"
                    >
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card>
                                <CardContent sx={{flexGrow: 1}}>
                                    <Typography variant="h6">{event.name}</Typography>
                                    <Typography color="text.secondary">{event.date}</Typography>
                                    <Typography variant="body3">
                                        {event.description || "No description provided."}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Link>
                ))}
            </Grid>

            <Button
                component={RouterLink}
                to={`/eventAdd`}
                variant="contained"
                color="primary"
                sx={{mt: 3}}
                onClick={() => console.log("Button clicked")}
            >
                Add New Event
            </Button>
        </Container>
    );
}

export default EventsPage;
