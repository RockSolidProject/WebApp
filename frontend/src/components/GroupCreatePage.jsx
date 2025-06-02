import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Alert, Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography} from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function GroupCreatePage() {
    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to create a group.");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/groups`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, isPrivate, description })
            });
            if(res.status === 401 || res.status === 403) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                setError("")
                navigate("/login")
                return
            }

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to create group");
            }

            const createdGroup = await res.json();
            navigate(`/groupDetail/${createdGroup._id}`);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>Ustvari Novo Skupino</Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Ime skupine"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                    }
                    label="Zasebna skupina"
                />

                <TextField
                    label="Opis"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                />

                <Button type="submit" variant="contained">
                    Ustvari Skupino
                </Button>

                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        </Container>
    );

}

export default GroupCreatePage;