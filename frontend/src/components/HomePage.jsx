import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SloveniaMap from './SloveniaMap';
import FilterSidebar from "./FilterSidebar.jsx";
import ClimbingAreaTable from "./ClimbingAreaTable.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const HomePage = () => {
    const [error, setError] = useState(null)
    const [climbingAreas, setClimbingAreas] = useState([])
    const [climbingCenters, setClimbingCenters] = useState([])
    const [requireBoulder, setRequireBoulder] = useState(false)
    const [requireLead, setRequireLead] = useState(false)
    const [requireUrban, setRequireUrban] = useState(false)
    const [requireMoonboard, setRequireMoonboard] = useState(false);
    const [requireSpraywall, setRequireSpraywall] = useState(false);
    const [requireLeadCenter, setRequireLeadCenter] = useState(false);
    const [requireBoulders, setRequireBoulders] = useState(false);
    const [requireKilter, setRequireKilter] = useState(false);
    const [requiredNumberOfRoutes, setRequiredNumberOfRoutes] = useState(1)
    const [latitude, setLatitude] = useState(46.1199444)
    const [longitude, setLongitude] = useState(15)
    const [distance, setDistance] = useState(135)
    const [distanceTmp, setDistanceTmp] = useState(distance)
    const [choosingLocation, setChoosingLocation] = useState(false);

    const [searchString, setSearchString] = useState("")

    const navigate = useNavigate()

    const isLoggedIn = (localStorage.getItem("token") != null && localStorage.getItem("user") != null)

    useEffect(() => {
        getClimbingAreas()
        getClimbingCenters()
    }, [distance, latitude, longitude])

    async function getClimbingAreas(){
        try {
            const res = await fetch(`${backendUrl}/climbingAreas/byProximity`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({latitude, longitude, distance})
            })
            if (!res.ok) {
                setError("Getting climbing spots failed.")
                return
            }
            const data = await res.json()
            //console.log(data) 
            setError("")

            setClimbingAreas(data)
        }
        catch (err) {
            //console.log("LLLLLLLLl")
            setError("Error getting climbing spots." + err.message)
        }
    }
    async function getClimbingCenters(){
        try {
            const res = await fetch(`${backendUrl}/climbingCenter/byProximity`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({latitude, longitude, distance})
            })
            if (!res.ok) {
                setError("Getting climbing spots failed.")
                return
            }
            const data = await res.json()
            console.log(data)
            setError("")

            setClimbingCenters(data)
        }
        catch (err) {
            //console.log("LLLLLLLLl")
            setError("Error getting climbing spots." + err.message)
        }
    }

    const filteredAreas = climbingAreas.filter(area => {
        let searchGood = area.name.toLowerCase().includes(searchString.toLowerCase())
        let boulderGood = false
        let leadGood = false
        let urbanGood = false
        let numberOfRoutesGood = (area.routes?.length || 0) >= requiredNumberOfRoutes

        const typesInArea = [...new Set(area.routes?.map(route => route.type))];

        if (!requireBoulder) {
            boulderGood = true
        }
        else {
            boulderGood = typesInArea.includes("boulder")
        }
        if (!requireLead) {
            leadGood = true
        }
        else {
            leadGood = typesInArea.includes("lead")
        }
        if (!requireUrban) {
            urbanGood = true
        }
        else {
            urbanGood = typesInArea.includes("urban")
        }
        
        return searchGood && boulderGood && leadGood && urbanGood && numberOfRoutesGood
    });
    const filteredCenters = climbingCenters.filter(center => {
        let searchGood = center.name.toLowerCase().includes(searchString.toLowerCase());
        let moonboardGood = !requireMoonboard || center.hasMoonboard;
        let spraywallGood = !requireSpraywall || center.hasSprayWall;
        let leadGood = !requireLeadCenter || center.hasRoutes;
        let bouldersGood = !requireBoulders || center.hasBoulders;
        let kilterGood = !requireKilter || center.hasKilter;

        return searchGood && moonboardGood && spraywallGood && leadGood && bouldersGood && kilterGood;
    });

    return (
        <div>
            <h1>Plezališča v Sloveniji</h1>
            <div style={{ display: 'flex', height: '70vh' }}>

                <FilterSidebar
                    requireBoulder = {requireBoulder}
                    setRequireBoulder = {setRequireBoulder}
                    requireLead = {requireLead}
                    setRequireLead = {setRequireLead}
                    requireUrban = {requireUrban}
                    setRequireUrban = {setRequireUrban}
                    requiredNumberOfRoutes = {requiredNumberOfRoutes}
                    setRequiredNumberOfRoutes = {setRequiredNumberOfRoutes}
                    distanceTmp = {distanceTmp}
                    setDistanceTmp = {setDistanceTmp}
                    setDistance={setDistance}
                    latitude={latitude}
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                    choosingLocation={choosingLocation}
                    setChoosingLocation={setChoosingLocation}
                    isLoggedIn={isLoggedIn}
                    navigate={navigate}
                    climbingAreas={climbingAreas}
                    setRequireMoonboard={setRequireMoonboard}
                    requireMoonboard={requireMoonboard}
                    setRequireSpraywall={setRequireSpraywall}
                    requireSpraywall={requireSpraywall}
                    setRequireLeadCenter={setRequireLeadCenter}
                    requireLeadCenter={requireLeadCenter}
                    setRequireBoulders={setRequireBoulders}
                    requireBoulders={requireBoulders}
                    setRequireKilter={setRequireKilter}
                    requireKilter={requireKilter}
                />

                <div style={{flex: 1}}>
                    <SloveniaMap 
                        climbingAreas={filteredAreas}
                        climbingCenters={filteredCenters}
                        latitude={latitude}
                        setLatitude={setLatitude}
                        longitude={longitude}
                        setLongitude={setLongitude}
                        distance={distanceTmp}
                        choosingLocation={choosingLocation}
                        setChoosingLocation={setChoosingLocation}
                    />
                    <input type="text" placeholder="Išči plezališče" value={searchString} onChange={(e) => setSearchString(e.target.value)}/>            
                    {error ? <p style={{color: "red"}}>{error}</p> :""}

                    <ClimbingAreaTable
                        filteredAreas={filteredAreas}
                    />

                </div>
            </div>
        </div>
    );
};

export default HomePage;