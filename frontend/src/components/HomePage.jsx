import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const HomePage = () => {
    const [error, setError] = useState(null)
    const [climbingAreas, setClimbingAreas] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getClimbingAreas()
    }, [])

    async function getClimbingAreas(){
            try {
                const res = await fetch(`${backendUrl}/climbingAreas`, {
                    method: "GET",
                })
                const data = await res.json()
                console.log(data)

                if (!res.ok) {
                    setError("Getting climbing spots failed.")
                    return
                }
                setClimbingAreas(data)
            }
            catch (err) {
                setError("Error getting climbing spots." + err.message)
            }
        }
    return (
        <div>
            <h1>Home page</h1>
            <ul>
                {climbingAreas.map( (climbingArea, index) => (
                    <li key={index}>
                        {climbingArea.name} 
                        {" ("+climbingArea.latitude+ "," + climbingArea.longitude + ")"}
                    </li>
                ))}
            </ul>
            <button onClick={()=>{navigate("/addClimbingArea")}}>Add climbing area</button>
        </div>
        
        
    );
};

export default HomePage;