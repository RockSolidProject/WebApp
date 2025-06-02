import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GroupAddMember from "./GroupAddMember.jsx";
import {
    Container, Typography, Button, List, ListItem, Alert, Box, Avatar, Card, CardContent
} from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function GroupDetailPage() {
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getGroup();
    }, [id]);

    async function getGroup() {
        try {
            const res = await fetch(`${backendUrl}/groups/${id}`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!res.ok) {
                setError("Error fetching group.");
                return;
            }

            const data = await res.json();
            setGroup(data);
        } catch (err) {
            console.error(err);
            setError("Could not fetch group.");
        }
    }

    async function handleAddMember() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            if (!selected) {
                setError("Missing member to add");
                return;
            }

            const res = await fetch(`${backendUrl}/groups/add`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    group: group._id,
                    member: selected
                }),
            });

            if (res.status === 401 || res.status === 403) {
                navigate("/login");
                return;
            } else if (!res.ok) {
                setError(`Issue adding a member`);
            }

            await getGroup();
            setSelected(null);
        } catch (e) {
            setError(`Error adding member: ${e.message}`);
            setSelected(null);
        }
    }

    async function joinGroup() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            const res = await fetch(`${backendUrl}/groups/join`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ groupId: group._id }),
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!res.ok) {
                setError(`Error joining group`);
                return;
            }

            setError("");
            await res.json();
            await getGroup();
        } catch (e) {
            setError(e.message || "An error occurred");
        }
    }

    if (!group) return <Typography>Loading group...</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {group.name}
                    </Typography>

                    {group.description && (
                        <Typography variant="body1" gutterBottom>
                            {group.description}
                        </Typography>
                    )}

                    {group.owner && (
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Owner: {group.owner.username}
                        </Typography>
                    )}

                    <Typography variant="subtitle2" gutterBottom>
                        {group.isPrivate ? "Private Group 🔒" : "Public Group 🔓"}
                    </Typography>

                    {!group.isPrivate && !group.isMember && (
                        <Button variant="contained" color="primary" onClick={joinGroup} sx={{ mt: 2 }}>
                            Join Group
                        </Button>
                    )}

                    {(group.isMember || group.isOwner) && (
                        <>
                            {group.isOwner && (
                                <>
                                    <Box mt={3}>
                                        <GroupAddMember onUserSelect={(user) => setSelected(user?.value)} />
                                        <Button
                                            onClick={handleAddMember}
                                            variant="contained"
                                            sx={{ mt: 1 }}
                                        >
                                            Add Member
                                        </Button>
                                    </Box>
                                </>
                            )}

                            <Box mt={4}>
                                <Typography variant="h6">Members</Typography>
                                <Box
                                    display="flex"
                                    flexWrap="wrap"
                                    gap={2}
                                    mt={2}
                                >
                                    {group.members?.map(({ member }) => (
                                        <Card key={member._id} sx={{ width: 160, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Avatar
                                                src={member.avatar ? `${backendUrl}${member.avatar}` : undefined}
                                                alt={member.username}
                                                sx={{ width: 48, height: 48, mb: 1 }}
                                            />
                                            <Typography variant="body2" align="center">
                                                {member.username}
                                            </Typography>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                        </>
                    )}

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Container>
    );

}

export default GroupDetailPage;
