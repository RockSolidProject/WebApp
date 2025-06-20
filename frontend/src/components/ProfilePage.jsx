import * as React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Box, Avatar
} from "@mui/material";
import defaultProfilePic from '../assets/default-avatar.png';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [averageAttempts, setAverageAttempts] = useState(0);


    const getUser = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${backendUrl}/users/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user")
                return navigate("/login");
            }

            if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await res.json();
            setUser(data);
            const averageAttempts = data.routesClimbed.length
                ? (data.routesClimbed.reduce((sum, r) => sum + r.attempts, 0)) / data.routesClimbed.length
                :0
            setAverageAttempts(averageAttempts)

        } catch (err) {
            setError(`Error fetching user: ${err.message}`);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await fetch(`${backendUrl}/users/avatar/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to upload avatar.");
            }

            const updatedUser = await res.json();
            setUser(updatedUser);

            const localUser = JSON.parse(localStorage.getItem("user"));
            if (localUser) {
                localUser.avatar = updatedUser.avatar;
                localStorage.setItem("user", JSON.stringify(localUser));
            }
            navigate("/profile");

        } catch (err) {
            setError(`Error uploading avatar: ${err.message}`);
        }
    };





    useEffect(() => {
        getUser();
    }, []);


    if (error) return <Alert severity="error">{error}</Alert>;
    if (!user) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" gutterBottom>Uporabniški profil</Typography>
                <Card>

                    <CardContent>
                        <Avatar
                            src={user.avatar ? `${backendUrl}${user.avatar}` : defaultProfilePic}
                            alt={user.username}
                            sx={{ width: 64, height: 64 }}
                        />

                        <Box mt={2}>
                            <label htmlFor="avatar-upload">
                                <input
                                    accept="image/*"
                                    id="avatar-upload"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarChange}
                                />
                                <Box
                                    component="span"
                                    sx={{
                                        color: 'primary.main',
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Spremeni Profilno Sliko
                                </Box>
                            </label>
                        </Box>
                        <Typography variant="h6">Uporabniško ime:</Typography>
                        <Typography>{user.username}</Typography>

                        <Typography variant="h6" mt={2}>Email:</Typography>
                        <Typography>{user.email || "Not provided"}</Typography>

                        <Typography variant="h6" mt={2}>Statistika:</Typography>
                        <Typography>Preplezane poti: {user.routesClimbed?user.routesClimbed.length:0}</Typography>
                        <Typography>Povprečni poskusi: {averageAttempts}</Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default ProfilePage;
