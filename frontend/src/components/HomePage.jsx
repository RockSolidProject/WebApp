import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const HomePage = () => {
    const [error, setError] = useState(null)
    const [climbingAreas, setClimbingAreas] = useState([])

    const [searchString, setSearchString] = useState("")

    const navigate = useNavigate()

    const isLoggedIn = (localStorage.getItem("token") != null && localStorage.getItem("user") != null)

    useEffect(() => {
        getClimbingAreas()
    }, [])

    async function getClimbingAreas(){
        try {
            const res = await fetch(`${backendUrl}/climbingAreas`, {
                method: "GET",
            })

            if (!res.ok) {
                setError("Getting climbing spots failed.")
                return
            }
            const data = await res.json()
            console.log(data)

            setClimbingAreas(data)
        }
        catch (err) {
            setError("Error getting climbing spots." + err.message)
        }
    }

    const filteredAreas = climbingAreas.filter(area =>
        area.name.toLowerCase().includes(searchString.toLowerCase())
    );

    return (
        <div>
            <h1>Domača stran</h1>

            <input type="text" placeholder="Išči plezališče" value={searchString} onChange={(e) => setSearchString(e.target.value)}/>

            <table>
                <thead>
                    <tr>
                        <th>Plezališče</th>
                        <th>Število poti</th>
                        <th>Vrste poti</th>
                    </tr>
                </thead>
                <tbody>
                {filteredAreas.map( (climbingArea, index) => (
                    <tr key={index}>
                        <td>{climbingArea.name}</td>
                        <td>{climbingArea.routes? climbingArea.routes.length : 0}</td>
                        <td>{(climbingArea.routes && climbingArea.routes.length > 0) ?(
                            [...new Set(climbingArea.routes.map(route => route.type))].join(","))
                        :"_"}</td>
                        
                        {/*" ("+climbingArea.latitude+ "," + climbingArea.longitude + ")"*/}
                        
                    </tr>
                ))}
                </tbody>
            </table>
            {isLoggedIn? <button onClick={()=>{navigate("/addClimbingArea")}}>Add climbing area</button> : ""}
        </div>
        
        
    );
};

export default HomePage;