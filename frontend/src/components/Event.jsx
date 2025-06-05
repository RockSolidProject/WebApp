import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Link,
    Box
} from "@mui/material";

function Event({ event }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const imageUrl = event.photo? `${backendUrl}${event.photo}` : `${backendUrl}/eventPhotos/default-event.jpg`;
    console.log(imageUrl);

    return (
        <Link
            component={RouterLink}
            to={`/event/${event._id}`}
            underline="none"
            sx={{ textDecoration: 'none' }}
        >
            <Card
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 3,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                    },
                }}
            >
                <CardMedia
                    component="img"
                    height="180"
                    image={imageUrl}
                    alt={event.name}
                    sx={{ objectFit: "cover" }}
                />
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                        {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(event.date).toLocaleDateString('sl-SI', {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}

export default Event;
