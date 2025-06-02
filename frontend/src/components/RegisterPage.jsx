import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Container,TextField,Button,Typography,Box} from '@mui/material';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const RegisterPage = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault()

        try {
            const res =  await fetch(`${backendUrl}/users/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, username, password})
            })

            if (res.status === 409) {
                setError("That username is already taken.")
                return
            }
            if (!res.ok) {
                setError("Registration failed.")
                return
            }
            const data = await res.json();

            navigate("/login")
        }
        catch (error) {
            setError("Error while registering")
        }

    }

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleRegister}>
                <Typography variant="h4" mt={2} gutterBottom>
                    Registracija
                </Typography>
                <TextField
                    label="Uporabniško ime"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Geslo"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <Box mt={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Registriraj se
                    </Button>
                </Box>
            </form>
            {error ? <p style={{color: "red"}}>{error}</p> : ""}
        </Container>
    );
};

export default RegisterPage;