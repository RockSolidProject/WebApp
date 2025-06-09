import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Stack,
} from "@mui/material";
import DOMPurify from "dompurify";
import Section from "../components/Section.jsx"
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
                    },
                });
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                if (!res.ok) throw new Error("Could not fetch event details.");
                const data = await res.json();
                if (!data) return setError("Manjkajoči podatki o dogodku.");
                setEvent(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchEvent();
    }, [id]);

    if (error) return <Typography color="error">{error}</Typography>;
    if (!event) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Box>
                <Box
                    component="img"
                    src={
                        event.photo
                            ? `${backendUrl}/${event.photo}`
                            : `${backendUrl}/eventPhotos/default-event.jpg`
                    }
                    alt={event.name}
                    sx={{
                        width: "100%",
                        maxHeight: 420,
                        objectFit: "cover",
                        borderRadius: 3,
                        mb: 4,
                        boxShadow: 2,
                    }}
                />

                <Typography variant="h3" component="h1" gutterBottom>
                    {event.name}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {new Date(event.date).toLocaleDateString("sl-SI", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </Typography>

                <Paper
                    elevation={1}
                    sx={{
                        backgroundColor: "#fff",
                        padding: 4,
                        borderRadius: 2,
                        mb: 4,
                        lineHeight: 1.8,
                        "& p": { mb: 2 },
                        "& ul": { pl: 3, mb: 2 },
                        "& ol": { pl: 3, mb: 2 },
                        "& h1, & h2, & h3": {
                            fontWeight: "bold",
                            mt: 3,
                            mb: 1,
                        },
                    }}
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                                event.description || "<p>Ni opisa za ta dogodek.</p>"
                            ),
                        }}
                    />
                </Paper>

                <Divider sx={{ mb: 4 }} />

                <Stack spacing={3}>
                    {event.climbingAreas?.length > 0 && (
                        <Section title="Plezališča" items={event.climbingAreas} />
                    )}
                    {event.climbingCenters?.length > 0 && (
                        <Section title="Plezalni Centri" items={event.climbingCenters} />
                    )}
                    <Typography variant={"h4"}></Typography>
                    {event.group && (
                        <Section title="Plezalni Centri" items={[event.group]} />
                    )}
                </Stack>
            </Box>
        </Container>
    );
}



export default EventDetailPage;
