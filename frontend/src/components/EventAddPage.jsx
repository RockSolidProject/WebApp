import React, {useState} from "react";
import {Autocomplete, Box, Button, Container, TextField, Typography,} from "@mui/material";
import {useNavigate} from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EventAddPage() {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        name: "",
        date: "",
        description: "",
        climbingSpots: [],
        climbingCenters: [],
        group: null,
    });

    const [spotOptions, setSpotOptions] = useState([]);
    const [centerOptions, setCenterOptions] = useState([]);
    const [groupOptions, setGroupOptions] = useState([]);
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/events/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name: eventData.name,
                    description: eventData.description,
                    climbingAreas: eventData.climbingSpots.map((spot) => spot._id),
                    climbingCenters: eventData.climbingCenters.map((center) => center._id),
                    group: eventData.group,
                    date: eventData.date,
                })
            });

            if (response.status === 401 || response.status === 403) {
                navigate("/login");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong");
            }

            const newEvent = await response.json();
            console.log("Event created:", newEvent);
            navigate("/events");
        } catch (err) {
            setError(err.message);
        }
    };

    // For spot search input change
    const handleSpotInputChange = async (event, value) => {
        if (value.length < 1) {
            setCenterOptions([]);
            return;
        }
        try {
            const res = await fetch(`${backendUrl}/climbingAreas/find?pattern=${value}&limit=${6}`)
            if (!res.ok) {
                setError("some issue with fetching centers");
                return;
            }
            const data = await res.json();
            setSpotOptions(data);
        } catch (error) {
            setError(error);
        }
    };

    // For center search input change
    const handleCenterInputChange = async (event, value) => {

        if (value.length < 1) {
            setCenterOptions([]);
            return;
        }
        try {
            const res = await fetch(`${backendUrl}/climbingCenter/find?pattern=${value}&limit=${6}`)
            if (!res.ok) {
                setError("some issue with fetching centers");
                return;
            }
            const data = await res.json();
            setCenterOptions(data);
        } catch (error) {
            setError(error);
        }

    };

    const handleGroupInputChange = async (event, value) => {
        if (value.length < 1) {
            setGroupOptions([]);
            return;
        }
        try {
            const res = await fetch(`${backendUrl}/groups/find?pattern=${value}&limit=${6}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            if (res.status === 401 || res.status === 403) {
                navigate("/login");
                return;
            } else if (!res.ok) {
                return setError(`Issue adding a member ${res.error || res.message}`)
            }
            const data = await res.json();
            setGroupOptions(data);

        } catch (error) {
            setError(`Error geting groups ${error}`);
            setGroupOptions([]);
        }
    }



    return (
        <Container maxWidth="sm">
            <Typography variant="h5" gutterBottom>
                Dodaj Nov Dogodek
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{mt: 2, display: "flex", flexDirection: "column", gap: 2}}
            >
                <TextField
                    name="name"
                    label="Ime Dogodka"
                    fullWidth
                    value={eventData.name}
                    onChange={(e) =>
                        setEventData({...eventData, name: e.target.value})
                    }
                    required
                />
                <TextField
                    name="date"
                    label="Datum Dogodka"
                    type="date"
                    fullWidth
                    value={eventData.date}
                    onChange={(e) =>
                        setEventData({...eventData, date: e.target.value})
                    }
                    InputLabelProps={{shrink: true}}
                    required
                />
                <Box sx={{ zIndex: 100, mb: 3 }}>
                    <Typography variant="subtitle1">Opis Dogodka</Typography>
                    <ReactQuill
                        theme="snow"
                        value={eventData.description}
                        onChange={(value) => setEventData({ ...eventData, description: value })}
                    />
                </Box>
                <Autocomplete
                    multiple
                    getOptionLabel={(option) => option.name || ""}
                    options={spotOptions}
                    onInputChange={handleSpotInputChange}
                    onChange={(e, value) =>
                        setEventData({...eventData, climbingSpots: value})
                    }
                    value={eventData.climbingSpots}
                    renderInput={(params) => (
                        <TextField {...params} label="Plezališča" fullWidth/>
                    )}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                />

                <Autocomplete
                    multiple
                    getOptionLabel={(option) => option.name || ""}
                    options={centerOptions}
                    onInputChange={handleCenterInputChange}
                    onChange={(e, value) =>
                        setEventData({...eventData, climbingCenters: value})
                    }
                    value={eventData.climbingCenters}
                    renderInput={(params) => (
                        <TextField {...params} label="Plezalni Centri" fullWidth/>
                    )}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                />

                <Autocomplete
                    getOptionLabel={(option) => option.name || ""}
                    options={groupOptions}
                    onInputChange={handleGroupInputChange}
                    onChange={(e, value) =>
                        setEventData({...eventData, group: value})
                    }
                    value={eventData.group}
                    renderInput={(params) => (
                        <TextField {...params} label="Skupina" fullWidth/>
                    )}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                />

                <Typography>{error}</Typography>
                <Button type="submit" variant="contained" color="primary" onSubmit={handleSubmit}>
                    Ustvari Dogodek
                </Button>
            </Box>
        </Container>
    );
}

export default EventAddPage;
