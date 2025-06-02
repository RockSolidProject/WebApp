import React, { useState, useEffect } from 'react';
import Group from "./Group.jsx";
import { Link } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        async function getGroups() {
            try {
                const res = await fetch('http://localhost:3001/groups');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setGroups(data);
            } catch (error) {
                console.error(error);
            }
        }

        getGroups();
    }, []);

    return (
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
    );
};

export default GroupsPage;
