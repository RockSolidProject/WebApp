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
    Link, Box
} from "@mui/material";
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import Event from "./Event.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EventsPage() {
    const [events, setEvents] = useState({publicEvents:[],myEvents:[]});
    const [error, setError] = useState("");
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
                if (res.status === 403 || res.status === 401) {
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

            <Box mb={3} display="flex" justifyContent="flex-end">
                <Button
                    component={RouterLink}
                    to={`/eventAdd`}
                    variant="contained"
                    color="primary"
                    sx={{mt: 3}}
                >
                    Dodaj Nov Dogodek
                </Button>
            </Box>
            <Typography variant="h4" gutterBottom>
                Prihajajoči dogodki
            </Typography>

            {loading && <CircularProgress sx={{mt: 4}}/>}

            {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Moji dogodki</Typography>
                {events.myEvents.map(event => (
                    <Event key={event._id} event={event} />
                ))}

                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Javni dogodki</Typography>
                {events.publicEvents.map(event => (
                    <Event key={event._id} event={event} />
                ))}
            </Box>

        </Container>
    );

}

export default EventsPage;
