import React, {useState, useEffect} from 'react';
import Group from "./Group.jsx";
import {Link} from "react-router-dom";
import {Box, Button, Container, Typography} from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const GroupsFromUser = () => {
    const [groups, setGroups] = useState({owned: [], membered: []});

    useEffect(() => {
        async function getGroups() {
            try {
                const res = await fetch(`${backendUrl}/groups/userGroups`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json' // Fix capitalization here
                    }
                });
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setGroups(data); // data should be { owned: [...], membered: [...] }
            } catch (error) {
                console.error(error);
            }
        }

        getGroups();
    }, []);

    return (
        <Container maxWidth="md" sx={{mt: 4}}>
            <Typography variant={"h3"}>Your groups</Typography>
            <Box mb={3} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/createGroup"
                >
                    Create a Group
                </Button>
            </Box>
            <Typography variant={"h4"}>Groups you own: </Typography>
            {groups.owned.length === 0 ? <p>No groups owned.</p> : (
                groups.owned.map((group) => (
                    <Group group={group} key={group._id}/>
                ))
            )}
            <Typography variant={"h4"}>Groups you are a member of: </Typography>
            {groups.membered.length === 0 ? <p>Not a member of any groups.</p> : (
                groups.membered.map((group) => (
                    <Group group={group} key={group._id}/>
                ))
            )}
        </Container>
    );
};
/*return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box mb={3} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/createGroup"
                >
                    Create a Group
                </Button>
            </Box>

            {groups.map((group) => (
                <Group group={group} key={group._id} />
            ))}
        </Container>
    );*/

export default GroupsFromUser;
