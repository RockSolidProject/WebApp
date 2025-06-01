import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SloveniaEmptyMap from './SloveniaEmptyMap';
import {Container,TextField,Typography,Button, Box} from '@mui/material';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const AddClimbingAreaPage = () => {
    const [name, setName] = useState("")    
    const [latitude, setLatitude] = useState(46.1199444)
    const [longitude, setLongitude] = useState(15)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    async function handleAddingClimbingCentre(e) {
        e.preventDefault()

        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }
        if (isNaN(latitude) || isNaN(longitude)){
            setError("Latitude and longitude must be numbers.")
            return
        }

        try {
            const res = await fetch(`${backendUrl}/climbingAreas`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, latitude, longitude})
            })

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                setError("")
                navigate("/login")
                return
            }
            if (!res.ok) {
                setError("Error adding climbing area.")
                return
            }
            const data = await res.json()

            setError("")
            navigate("/") //TODO can later maybe navigate to the this specificClimbingAreaPage
            return
        }
        catch (err) {
            //console.log("lol1" + err.message)
            setError("Error while adding climbing area: " + err.message)
        }
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" mt={2} gutterBottom>
                Dodajanje plezališča
            </Typography>

            <Box
                component="form"
                onSubmit={handleAddingClimbingCentre}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: "100%" }}
            >
                <SloveniaEmptyMap 
                    latitude={latitude} 
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                />
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary">
                    Add climbing area
                </Button>
            </Box>

            {error ? <p style={{color: "red"}}>{error}</p> : ""}
        </Container>
    );
};

export default AddClimbingAreaPage;