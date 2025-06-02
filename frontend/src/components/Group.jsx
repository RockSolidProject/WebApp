import { Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Group({ group }) {
    return (
        <Card
            sx={{
                mb: 2,
                p: 2,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: 3,
                },
                backgroundColor: '#fafafa',
                cursor: 'pointer',
            }}
        >
            <Link
                to={`/groupDetail/${group._id}`}
                style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                }}
            >
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {group.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {group.isPrivate ? 'Private group 🔒' : 'Public group 🔓'}
                    </Typography>
                    {group.description && (
                        <Typography variant="body2" mt={1}>
                            Description: {group.description}
                        </Typography>
                    )}
                </CardContent>
            </Link>
        </Card>
    );
}

export default Group;
