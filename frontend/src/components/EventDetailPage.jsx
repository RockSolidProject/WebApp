import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    Chip,
    CircularProgress,
    Divider,
} from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`${backendUrl}/events/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                if(res.status === 401 || res.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                if (!res.ok) throw new Error("Could not fetch event details.");
                const data = await res.json();
                if(!data){
                    return setError("missing data");
                }
                console.log(data.groups)
                setEvent(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchEvent();
    }, [id]);

    if (error) return <Typography color="error">{error}</Typography>;
    if (!event) return <CircularProgress />;

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    {event.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                    {new Date(event.date).toLocaleDateString('sl-SI', {
                        weekday: "short", // e.g., "pon." for "ponedeljek"
                        year: "numeric",  // e.g., "2025"
                        month: "short",   // e.g., "jun."
                        day: "numeric"    // e.g., "2"
                    })}
                </Typography>

                <Typography variant="body1">
                    {event.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Plezališča</Typography>
                <Box mb={2}>
                    {event.climbingAreas?.map((area) => (
                        <Chip key={area._id} label={area.name} sx={{ m: 0.5 }} />
                    ))}
                </Box>

                <Typography variant="h6">Plezalni centri</Typography>
                <Box mb={2}>
                    {event.climbingCenters?.map((center) => (
                        <Chip key={center._id} label={center.name} sx={{ m: 0.5 }} />
                    ))}
                </Box>

                <Typography variant="h6">Skupine</Typography>
                <Box mb={2}>
                    {event.groups?.map((group) => (
                        <Chip key={group._id} label={group.name} sx={{ m: 0.5 }} />
                    ))}
                </Box>
            </Box>
        </Container>
    );
}

export default EventDetailPage;