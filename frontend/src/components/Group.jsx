import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    CardMedia,
} from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Group({ group }) {
    const groupPhotoUrl = group.photo
        ? `${backendUrl}${group.photo}`
        : `${backendUrl}/groups/default-group.png`;

    const ownerPhotoUrl = group.owner?.avatar
        ? `${backendUrl}${group.owner.avatar}`
        : null;

    const ownerInitial = group.owner?.username?.[0]?.toUpperCase() || "?";

    return (
        <Card
            component={Link}
            to={`/groupDetail/${group._id}`}
            sx={{
                mb: 3,
                textDecoration: 'none',
                color: 'inherit',
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                },
                backgroundColor: '#fff',
                borderRadius: 3,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative'
            }}
        >
            {/* Slika skupine */}
            <CardMedia
                component="img"
                height="200"
                image={groupPhotoUrl}
                alt={group.name}
                sx={{ objectFit: "cover", width: "100%" }}
            />

            {/* Badge z lastnikom */}
            {group.owner && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2,
                        px: 1.2,
                        py: 0.5,
                        boxShadow: 1,
                    }}
                >
                    <Avatar
                        src={ownerPhotoUrl}
                        alt={group.owner.username}
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: ownerPhotoUrl ? "transparent" : "#bbb",
                            fontSize: 14,
                            fontWeight: "bold",
                        }}
                    >
                        {!ownerPhotoUrl && ownerInitial}
                    </Avatar>
                    <Typography variant="body2" fontWeight={500}>
                        {group.owner.username}
                    </Typography>
                </Box>
            )}

            {/* Vsebina */}
            <CardContent sx={{ px: 2, pt: 2, pb: 2 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    {group.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {group.isPrivate ? 'Zasebna Skupina 🔒' : 'Javna Skupina 🔓'}
                </Typography>
                {group.description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {group.description}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default Group;
