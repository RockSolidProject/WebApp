import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import ShowLocationOnMap from './ShowLocationOnMap.jsx';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ClimbingAreaPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [area, setArea] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchArea() {
            try {
                const res = await fetch(`${backendUrl}/climbingAreas/${id}`);
                if (!res.ok) {
                    setError('Failed to fetch climbing area.');
                    return;
                }
                const data = await res.json();
                setArea(data);
            } catch (err) {
                setError('Error fetching climbing area.');
            }
        }
        async function getRoutes() {
            try {
                const res = await fetch(`${backendUrl}/climbingRoutes/byArea/${id}`);
                if(!res.ok) {
                    setError('Failed to fetch routes.');
                    return;
                }
                const data = await res.json();
                setRoutes(data);
            } catch (err){
                setError('Error getting routes.');
            }
        }
        fetchArea();
        getRoutes();
    }, [id]);

    if (error) return <Typography color="error">{error}</Typography>;
    if (!area) return <Typography>Loading...</Typography>;

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ minWidth: 350, maxWidth: 600, width: '100%' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{area.name}</Typography>
                    <Typography variant="body1"><strong>Latitude:</strong> {area.latitude}</Typography>
                    <Typography variant="body1"><strong>Longitude:</strong> {area.longitude}</Typography>
                    <Typography variant="body1"><strong>Posted by:</strong> {area.postedBy?.username || 'Unknown'}</Typography>
                    <Box my={2}>
                        <ShowLocationOnMap latitude={area.latitude} longitude={area.longitude} />
                    </Box>
                    <Box mb={2}>
                        <Button
                            component={Link}
                            to={`/climbingAreas/${id}/addRoute`}
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Add New Route
                        </Button>
                    </Box>
                    <Typography variant="h6" color="primary" gutterBottom>Routes</Typography>
                    {routes && routes.length > 0 ? (
                        <List>
                            {routes.map(route => (
                                <ListItem
                                    key={route._id}
                                    button
                                    onClick={() => navigate(`/climbingRoutes/${route._id}`)}
                                >
                                    <ListItemText
                                        primary={`${route.name} (${route.type})`}
                                        secondary={route.postedBy ? `by ${route.postedBy.username}` : ''}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="text.secondary">No routes available.</Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ClimbingAreaPage;