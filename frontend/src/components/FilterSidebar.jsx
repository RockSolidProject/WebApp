import React from 'react';

const FilterSidebar = ({requireBoulder, setRequireBoulder, requireLead, setRequireLead, requireUrban, setRequireUrban, requiredNumberOfRoutes, setRequiredNumberOfRoutes,
      distanceTmp, setDistanceTmp, setDistance, latitude, setLatitude, longitude, setLongitude, choosingLocation, setChoosingLocation, isLoggedIn, navigate, climbingAreas
}) => {
    return (
        <div style={{
            width: "200px",
            maxWidth: "20%",
            padding: "20px",
            height: "100%",
            marginRight: "15px",
            backgroundColor: "grey"}}>
            <h2>Filtri:</h2>
            <h3>Glede na vrto poti: </h3>
            <label>
                <input type="checkbox" checked={requireBoulder} onChange={()=>setRequireBoulder(!requireBoulder)}/>
                Balvanska pot
                <br/>
            </label>
            <label>
                <input type="checkbox" checked={requireLead} onChange={()=>setRequireLead(!requireLead)}/>
                Športna pot
                <br/>
            </label>
            <label>
                <input type="checkbox" checked={requireUrban} onChange={()=>setRequireUrban(!requireUrban)}/>
                Urbana pot
                <br/>
            </label>

            <h3>Število poti:</h3>
            <div>Vsaj: {requiredNumberOfRoutes}</div>
            <input type="range" min={0} max={Math.max(1, ...climbingAreas.map(a => a.routes?.length || 0))}
                   value={requiredNumberOfRoutes} onChange={(e) => setRequiredNumberOfRoutes(Number(e.target.value))}
            />
            <h3>Razdalja: </h3>
            <div>Vsaj: {distanceTmp}km</div>
            <input type="range" min={5} max={135} step={1}
                   value={distanceTmp}
                   onTouchEnd={() => setDistance(distanceTmp)}
                   onMouseUp={() => setDistance(distanceTmp)}
                   onChange={(e) => setDistanceTmp(Number(e.target.value))}
            /><br/>
            <h4 style={{marginBottom: 0}}>Lokacija:</h4>
            <button onClick={() => setChoosingLocation(!choosingLocation)}>📌</button><br/>
            <label>
                Latitude: <br />
                <input
                    type="number" value={latitude} onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    step="any" required
                />
            </label>
            <label>
                Longitude: <br />
                <input
                    type="number" value={longitude} onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    step="any" required
                />
            </label>
            <br/><br/><br/>
            {isLoggedIn? <button onClick={()=>{navigate("/addClimbingArea")}}>Add climbing area</button> : ""}
        </div>
    );
};

export default FilterSidebar;