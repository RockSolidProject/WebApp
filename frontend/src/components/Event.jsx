// src/components/EventCard.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Link
} from "@mui/material";

function Event({ event }) {
    return (
        <Link
            component={RouterLink}
            to={`/event/${event._id}`}
            underline="none"
            sx={{ textDecoration: 'none' }}
        >
            <Card
                sx={{
                    mb: 2,
                    p: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                    },
                }}
            >
                <CardContent>
                    <Typography variant="h6">{event.name}</Typography>
                    <Typography color="text.secondary">
                        {new Date(event.date).toLocaleDateString('sl-SI', {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                        {event.description || "Brez opisa."}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}

export default Event;
