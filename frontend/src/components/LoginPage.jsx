import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Container,TextField,Button,Typography,Box} from '@mui/material';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LoginPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault()

        try {

            const res = await fetch(`${backendUrl}/users/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
            })

            if (res.status === 401) {
                setError("Invalid username or password")
                return
            }
            if (!res.ok) {
                setError("Error logging in.")
                return
            }
            const data = await res.json()

            setError("")
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.userData))
            navigate("/")
        }
        catch (err) {
            setError("Error while loggin in")
        }
    }

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleLogin}>
                <Typography variant="h4" mt={2} gutterBottom>
                    Prijava
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
                        Prijava
                    </Button>
                </Box>
            </form>
            {error ? <p style={{color: "red"}}>{error}</p> : ""}
        </Container>
    );
};

export default LoginPage;