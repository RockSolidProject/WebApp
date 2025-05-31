import React, { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Autocomplete,
} from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function AddEventForm({ onSubmit }) {
    const [eventData, setEventData] = useState({
        name: "",
        date: "",
        description: "",
        climbingSpot: null,
        climbingCenter: null,
        group: null,
    });

    const [spotOptions, setSpotOptions] = useState([]);
    const [centerOptions, setCenterOptions] = useState([]);

    // Helper function to fetch filtered spots
    async function fetchSpots(query) {
        const res = await fetch(
            `${backendUrl}/climbingSpots?search=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        return data; // expected array of { _id, name }
    }

    // Helper function to fetch filtered centers
    async function fetchCenters(query) {
        const res = await fetch(
            `${backendUrl}/climbingCenters?search=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        return data;
    }

    // For spot search input change
    const handleSpotInputChange = async (event, value) => {
        if (value.length < 2) {
            setSpotOptions([]); // clear options if less than 2 chars
            return;
        }
        const spots = await fetchSpots(value);
        setSpotOptions(spots);
    };

    // For center search input change
    const handleCenterInputChange = async (event, value) => {
        if (value.length < 2) {
            setCenterOptions([]);
            return;
        }
        const centers = await fetchCenters(value);
        setCenterOptions(centers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(eventData);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" gutterBottom>
                Add New Event
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    name="name"
                    label="Event Name"
                    fullWidth
                    value={eventData.name}
                    onChange={(e) =>
                        setEventData({ ...eventData, name: e.target.value })
                    }
                    required
                />
                <TextField
                    name="date"
                    label="Event Date"
                    type="date"
                    fullWidth
                    value={eventData.date}
                    onChange={(e) =>
                        setEventData({ ...eventData, date: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    name="description"
                    label="Description"
                    multiline
                    minRows={3}
                    fullWidth
                    value={eventData.description}
                    onChange={(e) =>
                        setEventData({ ...eventData, description: e.target.value })
                    }
                />

                {/* Async Autocomplete for Climbing Spot */}
                <Autocomplete
                    getOptionLabel={(option) => option.name || ""}
                    options={spotOptions}
                    onInputChange={handleSpotInputChange}
                    onChange={(e, value) =>
                        setEventData({ ...eventData, climbingSpot: value })
                    }
                    value={eventData.climbingSpot}
                    renderInput={(params) => (
                        <TextField {...params} label="Climbing Spot" fullWidth />
                    )}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    noOptionsText="No spots found"
                />

                {/* Async Autocomplete for Climbing Center */}
                <Autocomplete
                    getOptionLabel={(option) => option.name || ""}
                    options={centerOptions}
                    onInputChange={handleCenterInputChange}
                    onChange={(e, value) =>
                        setEventData({ ...eventData, climbingCenter: value })
                    }
                    value={eventData.climbingCenter}
                    renderInput={(params) => (
                        <TextField {...params} label="Climbing Center" fullWidth />
                    )}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    noOptionsText="No centers found"
                />

                {/* You can do a similar autocomplete for Groups */}

                <Button type="submit" variant="contained" color="primary">
                    Create Event
                </Button>
            </Box>
        </Container>
    );
}

export default AddEventForm;
