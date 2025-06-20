import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    TextField, Typography,
} from "@mui/material";
import { Link , useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import Group from "./Group.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [onlyMine, setOnlyMine] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        async function getGroups() {
            try {
                const res = await fetch(`${backendUrl}/groups`,{
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if(res.status === 401 || res.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
                if(!res.ok) {
                    setError("Napaka pri pridobivanju skupin");
                }
                const data = await res.json();
                setGroups(data);
            } catch (err) {
                console.error(err);
            }
        }

        getGroups();
    }, []);

    const filteredGroups = groups.filter((group) => {
        const nameMatches = group.name.toLowerCase().includes(search.toLowerCase());
        const mineMatches = !onlyMine || group.mine;
        return nameMatches && mineMatches;
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Header z iskalnikom in gumbom */}
            <Box
                mb={3}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
            >
                <Box display="flex" alignItems="center" gap={3}> {/* gap=2 je 16px */}
                    <TextField
                        label="Išči po imenu"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={onlyMine}
                                onChange={(e) => setOnlyMine(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Moje"
                    />
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/createGroup"
                >
                    Ustvari skupino
                </Button>
            </Box>

            {/* Prikaz skupin */}
            <Grid container spacing={3}>
                {filteredGroups.map((group) => (
                    <Grid item xs={12} sm={6} md={4} key={group._id}>
                        <Group group={group} />
                    </Grid>
                ))}
            </Grid>
            <Typography>{error}</Typography>
        </Container>

    );
};

export default GroupsPage;
