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

const token = localStorage.getItem("token");
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [averageGrade, setAverageGrade] = useState(0);
    const [averageAttempts, setAverageAttempts] = useState(0);

    const getClimbed = async () => {
        try {
            const res = await fetch(`${backendUrl}/users`, {});
        }catch(e) {
            setError(`could not find climbed routes ${e}`);
        }
    }

    const getUser = async () => {
        try {
            const originalUser = await JSON.parse(localStorage.getItem("user"));
            const res = await fetch(`${backendUrl}/users/${originalUser.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
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
            const res = await fetch(`${backendUrl}/users/avatar/${originalUser.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to upload avatar.");
            }

            const updatedUser = await res.json();
            setUser(updatedUser);
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
                <Typography variant="h4" gutterBottom>User Profile</Typography>
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
                                    Change Profile Picture
                                </Box>
                            </label>
                        </Box>
                        <Typography variant="h6">Username:</Typography>
                        <Typography>{user.username}</Typography>

                        <Typography variant="h6" mt={2}>Email:</Typography>
                        <Typography>{user.email || "Not provided"}</Typography>

                        <Typography variant="h6" mt={2}>User Statistics:</Typography>
                        <Typography>Routes climbed: {user.routesClimbed?user.routesClimbed.length:0}</Typography>
                        <Typography>Average attempts: {averageAttempts}</Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default ProfilePage;
