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
    const groupPhotoUrl = group.image
        ? `${backendUrl}${group.image}`
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
                height: 300,
                position: 'relative',
                maxWidth: 300,
                width: 300,
            }}
        >
            <CardMedia
                component="img"
                image={groupPhotoUrl}
                alt={group.name}
                sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                }}
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

            <CardContent sx={{ px: 2, pt: 2, pb: 2 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        display: 'block',
                    }}
                >
                    {group.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {group.isPrivate ? 'Zasebna Skupina 🔒' : 'Javna Skupina 🔓'}
                </Typography>
            </CardContent>
        </Card>

    );
}

export default Group;
