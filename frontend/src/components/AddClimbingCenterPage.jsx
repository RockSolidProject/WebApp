import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SloveniaEmptyMap from './SloveniaEmptyMap';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddClimbingCenterPage = () => {
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState(46.1199444)
    const [longitude, setLongitude] = useState(15)
    const [hasBoulders, setHasBoulders] = useState(false);
    const [hasRoutes, setHasRoutes] = useState(false);
    const [hasMoonboard, setHasMoonboard] = useState(false);
    const [hasSprayWall, setHasSprayWall] = useState(false);
    const [hasKilter, setHasKilter] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleAddingClimbingCenter(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored in localStorage

        if (!token || !user || !user.id) {
            navigate("/login");
            return;
        }

        if (isNaN(latitude) || isNaN(longitude)) {
            setError("Latitude and longitude must be numbers.");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/climbingCenter/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    latitude,
                    longitude,
                    owner: user.id, // Include the owner field
                    hasBoulders,
                    hasRoutes,
                    hasMoonboard,
                    hasSprayWall,
                    hasKilter
                })
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setError("");
                navigate("/login");
                return;
            }
            if (!res.ok) {
                setError("Error adding climbing center.");
                return;
            }
            const data = await res.json();

            setError("");
            navigate("/");
        } catch (err) {
            setError("Error while adding climbing center: " + err.message);
        }
    }

    return (
        <>
            <h1>Add Climbing Center</h1>
            <form onSubmit={handleAddingClimbingCenter}>
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
                        Latitude: <br />
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
                <div>
                    <label>
                        <input type="checkbox" checked={hasBoulders}
                               onChange={e => setHasBoulders(e.target.checked)} />
                        Has Boulders
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={hasRoutes}
                               onChange={e => setHasRoutes(e.target.checked)} />
                        Has Routes
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={hasMoonboard}
                               onChange={e => setHasMoonboard(e.target.checked)} />
                        Has Moonboard
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={hasSprayWall}
                               onChange={e => setHasSprayWall(e.target.checked)} />
                        Has Spray Wall
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={hasKilter}
                               onChange={e => setHasKilter(e.target.checked)} />
                        Has Kilter
                    </label>
                </div>
                <button type="submit">Add Climbing Center</button>
            </form>
            {error ? <p style={{color: "red"}}>{error}</p> : ""}
        </>
    );
};

export default AddClimbingCenterPage;