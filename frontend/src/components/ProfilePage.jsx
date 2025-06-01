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
const originalUser = JSON.parse(localStorage.getItem("user"));

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const getUser = async () => {
        try {
            const res = await fetch(`${backendUrl}/users/${originalUser.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401 || res.status === 403) {
                return navigate("/login");
            }

            if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await res.json();
            setUser(data);
        } catch (err) {
            setError(`Error fetching user: ${err.message}`);
        }
    };

    const getProfilePicture = async () => {
        if (!user) {

        }
    }



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
                            src={defaultProfilePic}
                            alt={user.username}
                            sx={{ width: 64, height: 64 }}
                        />
                        <Typography variant="h6">Username:</Typography>
                        <Typography>{user.username}</Typography>

                        <Typography variant="h6" mt={2}>Email:</Typography>
                        <Typography>{user.email || "Not provided"}</Typography>

                        {user.role && (
                            <>
                                <Typography variant="h6" mt={2}>Role:</Typography>
                                <Typography>{user.role}</Typography>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default ProfilePage;
