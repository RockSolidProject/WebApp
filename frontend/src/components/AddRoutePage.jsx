import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    Button,
    Alert
} from '@mui/material';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AddRoutePage() {
    const { id: climbingAreaId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [type, setType] = useState('lead');
    const [length, setLength] = useState('');
    const [grade, setGrade] = useState('');
    const [attempts, setAttempts] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const ropeGrades = [
        "3", "3+", "4a", "4b", "4c",
        "5a", "5b", "5c",
        "6a", "6a+", "6b", "6b+", "6c", "6c+",
        "7a", "7a+", "7b", "7b+", "7c", "7c+",
        "8a", "8a+", "8b", "8b+", "8c", "8c+",
        "9a", "9a+", "9b", "9b+", "9c", "9c+"
    ];
    const boulderGrades = [
        "3", "3+", "4", "4+", "5", "5+",
        "6A", "6A+", "6B", "6B+", "6C", "6C+",
        "7A", "7A+", "7B", "7B+", "7C", "7C+",
        "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"
    ];
    const urbanGrades = [
        "I", "II", "III", "IV", "IV+", "V", "V+", "VI", "VI+",
        "VII", "VII+", "VIII", "VIII+", "IX", "IX+", "X", "X+", "XI", "XI+"
    ];

    const getGradeOptions = () => {
        if (type === "boulder") return boulderGrades;
        if (type === "lead") return ropeGrades;
        if (type === "urban") return urbanGrades;
        return [];
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !length || !grade || !attempts) {
            setError("All fields are required.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const routeRes = await fetch(`${backendUrl}/climbingRoutes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    type,
                    length: parseFloat(length),
                    climbingArea: climbingAreaId
                })
            });

            if (routeRes.status === 401 || routeRes.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            if (!routeRes.ok) {
                const data = await routeRes.json();
                setError(data.message || "Error adding route.");
                return;
            }

            const newRoute = await routeRes.json();

            const climbedRes = await fetch(`${backendUrl}/routeConnections/climbed/${newRoute._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    gradeOpinion: grade,
                    attempts: Number(attempts)
                })
            });

            if (climbedRes.status === 401 || climbedRes.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            if (!climbedRes.ok) {
                const data = await climbedRes.json();
                setError(data.message || "Error marking as climbed.");
                return;
            }

            setSuccess("Route added and marked as climbed successfully!");
            setError('');
            navigate(`/climbingAreas/${climbingAreaId}`);
        } catch (err) {
            setError("Error adding route: " + err.message);
        }
    }

    return (
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Dodaj novo pot
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Ime poti"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <TextField
                        select
                        label="Tip"
                        fullWidth
                        margin="normal"
                        value={type}
                        onChange={e => { setType(e.target.value); setGrade(''); }}
                    >
                        <MenuItem value="lead">Športna pot</MenuItem>
                        <MenuItem value="boulder">Balvan</MenuItem>
                        <MenuItem value="urban">Urbana pot</MenuItem>
                    </TextField>
                    <TextField
                        label="Dolžina (m)"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={length}
                        onChange={e => setLength(e.target.value)}
                        required
                    />
                    <TextField
                        select
                        label="Ocena"
                        fullWidth
                        margin="normal"
                        value={grade}
                        onChange={e => setGrade(e.target.value)}
                        required
                    >
                        <MenuItem value="">Izberi težavnost</MenuItem>
                        {getGradeOptions().map((g, i) => (
                            <MenuItem key={i} value={g}>{g}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Število poizkusov"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={attempts}
                        onChange={e => setAttempts(e.target.value)}
                        required
                        inputProps={{ min: 1 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Dodaj pot
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </CardContent>
        </Card>
    );
}
