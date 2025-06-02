import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import ShowLocationOnMap from './ShowLocationOnMap.jsx';
import { ListItemButton } from '@mui/material';
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

    function translateRouteType(type) {
        switch (type) {
            case "lead":
                return "Športna pot";
            case "boulder":
                return "Balvan";
            case "urban":
                return "Urbana pot";
            default:
                return type;
        }
    }
    if (error) return <Typography color="error">{error}</Typography>;
    if (!area) return <Typography>Loading...</Typography>;

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ minWidth: 350, maxWidth: 800, width: '100%' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{area.name}</Typography>
                    <Typography variant="body1"><strong>Objavil:</strong> {area.postedBy?.username || 'Unknown'}</Typography>
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
                            Dodaj novo pot
                        </Button>
                    </Box>
                    <Typography variant="h6" color="primary" gutterBottom>Poti</Typography>
                    {routes && routes.length > 0 ? (
                        <List>
                            {routes.map(route => (
                                <ListItem key={route._id} disablePadding>
                                    <ListItemButton onClick={() => navigate(`/climbingRoutes/${route._id}`)}>
                                        <ListItemText
                                            primary={`${route.name} (${translateRouteType(route.type)})`}
                                            secondary={route.postedBy ? `Objavil: ${route.postedBy.username}` : ''}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="text.secondary">Ni poti.</Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ClimbingAreaPage;