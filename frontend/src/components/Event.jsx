import React from "react";
import {Link as RouterLink} from "react-router-dom";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Link,
    Box,
    Avatar
} from "@mui/material";

function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).slice(-2);
    }
    return color;
}

function Event({event}) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const imageUrl = event.photo
        ? `${backendUrl}${event.photo}`
        : `${backendUrl}/eventPhotos/default-event.jpg`;

    const group = event.group;
    const groupPhotoUrl = group?.photo ? `${backendUrl}${group.photo}` : null;
    const groupColor = stringToColor(group?._id || "default");

    return (
        <Link
            component={RouterLink}
            to={`/event/${event._id}`}
            underline="none"
            sx={{textDecoration: "none"}}
        >
            <Card
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 3,
                    position: "relative",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                    },
                }}
            >
                {/* Group badge */}
                {group && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            bgcolor: "white",
                            borderRadius: 2,
                            px: 1,
                            py: 0.5,
                            boxShadow: 1,
                        }}
                    >
                        <Avatar
                            alt={group.name}
                            src={groupPhotoUrl}
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: groupPhotoUrl ? "transparent" : groupColor,
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        >
                            {!groupPhotoUrl && group.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight="500" color="text.primary">
                            {group.name}
                        </Typography>
                    </Box>
                )}

                <CardMedia
                    component="img"
                    height="180"
                    image={imageUrl}
                    alt={event.name}
                    sx={{objectFit: "cover"}}
                />
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                        {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(event.date).toLocaleDateString("sl-SI", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}

export default Event;
