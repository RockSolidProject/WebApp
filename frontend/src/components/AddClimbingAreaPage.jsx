import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SloveniaEmptyMap from './SloveniaEmptyMap';

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
            console.log("lol1" + err.message)
            setError("Error while adding climbing area: " + err.message)
        }
    }

    return (
        <>
            <h1>Add climbing area</h1>  
            <form onSubmit={handleAddingClimbingCentre}>
                <div>
                    <label>
                        Name: <br />
                        <input type="text" value={name}
                        onChange={e => setName(e.target.value)} required
                    />
                    </label>
                </div>
                <SloveniaEmptyMap 
                    latitude={latitude} 
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                />
                <div>
                    <label>
                        Latidue: <br />
                        <input type="text" value={latitude}
                        onChange={e => setLatitude(e.target.value)} required
                    />
                    </label>
                </div>
                <div>
                    <label>
                        Longitude: <br />
                        <input type="text" value={longitude}
                        onChange={e => setLongitude(e.target.value)} required
                    />
                    </label>
                </div>
                <button type="submit">Add climbing area</button>
            </form>
            {error ? <p style={{color: "red"}}>{error}</p> : ""}
        </>
    );
};

export default AddClimbingAreaPage;