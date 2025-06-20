import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SloveniaEmptyMap from './SloveniaEmptyMap';
import {Container,TextField,Typography,Button, Box, FormControlLabel, Checkbox, Stack} from '@mui/material';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddClimbingCenterPage = () => {
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState(46.1199444)
    const [longitude, setLongitude] = useState(15)
    const [hasBoulders, setHasBoulders] = useState(false);
    const [hasRoutes, setHasRoutes] = useState(false);
    const [hasMoonboard, setHasMoonboard] = useState(false);
    const [hasSprayWall, setHasSprayWall] = useState(false);
    const [hasKilter, setHasKilter] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleAddingClimbingCenter(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user || !user.id) {
            navigate("/login");
            return;
        }

        if (isNaN(latitude) || isNaN(longitude)) {
            setError("Latitude and longitude must be numbers.");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/climbingCenter/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    latitude,
                    longitude,
                    owner: user.id,
                    hasBoulders,
                    hasRoutes,
                    hasMoonboard,
                    hasSprayWall,
                    hasKilter
                })
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setError("");
                navigate("/login");
                return;
            }
            if (!res.ok) {
                setError("Error adding climbing center.");
                return;
            }
            const data = await res.json();

            setError("");
            navigate("/");
        } catch (err) {
            setError("Error while adding climbing center: " + err.message);
        }
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" mt={2} gutterBottom>
                Dodajanje plezalnega centra
            </Typography>
            <Box
                component="form"
                onSubmit={handleAddingClimbingCenter}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: "100%" }}
            >
                <SloveniaEmptyMap 
                    latitude={latitude} 
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                />
                <TextField
                    label="Ime"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                />

                <Stack direction="column" spacing={0}>
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={hasBoulders}
                            onChange={(e) => setHasBoulders(e.target.checked)}
                            />
                        }
                        sx={{ mt: -1 }}
                        label="Ima bolderje"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={hasRoutes}
                            onChange={(e) => setHasRoutes(e.target.checked)}
                            />
                        }
                        sx={{ mt: -1 }}
                        label="Ima plezanlne poti"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={hasMoonboard}
                            onChange={(e) => setHasMoonboard(e.target.checked)}
                            />
                        }
                        sx={{ mt: -1 }}
                        label="Ima moonboard"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={hasSprayWall}
                            onChange={(e) => setHasSprayWall(e.target.checked)}
                            />
                        }
                        sx={{ mt: -1 }}
                        label="Ima šutalnico"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={hasKilter}
                            onChange={(e) => setHasKilter(e.target.checked)}
                            />
                        }
                        sx={{ mt: -1 }}
                        label="Ima kilter"
                    />
                </Stack>

                <Button type="submit" variant="contained" color="primary">
                    Dodaj plezalni center
                </Button>
            </Box>
            {error ? <p style={{color: "red"}}>{error}</p> : ""}
        </Container>
    );
};

export default AddClimbingCenterPage;