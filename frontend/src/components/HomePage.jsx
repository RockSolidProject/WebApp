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
            <h1>Plezališča v Sloveniji</h1>
            <div style={{ display: 'flex', height: '70vh' }}>
                <div style={{width: "200px", maxWidth: "20%", padding: "20px", height: "100%", marginRight: "15px", backgroundColor: "grey"}}> 
                    <h3>Filtri:</h3>
                    {isLoggedIn? <button style={{marginTop: "100%"}} onClick={()=>{navigate("/addClimbingArea")}}>Add climbing area</button> : ""}
                </div>
                
                <div style={{flex: 1}}>
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
                </div>
            </div>
        </div>
    );
};

export default HomePage;