import React, {useState} from 'react';

const FilterSidebar = ({requireBoulder, setRequireBoulder, requireLead, setRequireLead, requireUrban, setRequireUrban, requiredNumberOfRoutes, setRequiredNumberOfRoutes,
      distanceTmp, setDistanceTmp, setDistance, latitude, setLatitude, longitude, setLongitude, choosingLocation, setChoosingLocation, isLoggedIn, navigate, climbingAreas, setRequireMoonboard, requireMoonboard,
      setRequireSpraywall, requireSpraywall, setRequireLeadCenter, requireLeadCenter, setRequireBoulders, requireBoulders, setRequireKilter, requireKilter
}) => {
    const [showOutdoorFilters, setShowOutdoorFilters] = useState(false);
    const [showCenterFilters, setShowCenterFilters] = useState(false);
    return (
        <div style={{
            width: "200px",
            maxWidth: "20%",
            padding: "20px",
            height: "100%",
            marginRight: "15px",
            backgroundColor: "grey"}}>
            <h2>Filters:</h2>
            <label style={{ display: "block", marginBottom: "10px" }}>
                <input
                    type="checkbox"
                    checked={showOutdoorFilters}
                    onChange={() => setShowOutdoorFilters(!showOutdoorFilters)}
                />
                Outdoor Climbing Areas
            </label>
            {showOutdoorFilters && (
                <div style={{ padding: "10px", marginBottom: "15px" }}>
                    <h3>By Route Type:</h3>
                    <label>
                        <input
                            type="checkbox"
                            checked={requireBoulder}
                            onChange={() => setRequireBoulder(!requireBoulder)}
                        />
                        Boulder Route
                        <br />
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={requireLead}
                            onChange={() => setRequireLead(!requireLead)}
                        />
                        Lead Route
                        <br />
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={requireUrban}
                            onChange={() => setRequireUrban(!requireUrban)}
                        />
                        Urban Route
                        <br />
                    </label>
                    <h3>Number of Routes:</h3>
                    <div>At least: {requiredNumberOfRoutes}</div>
                    <input
                        type="range"
                        min={0}
                        max={Math.max(1, ...climbingAreas.map(a => a.routes?.length || 0))}
                        value={requiredNumberOfRoutes}
                        onChange={(e) => setRequiredNumberOfRoutes(Number(e.target.value))}
                    />
                </div>
            )}

            <label style={{ display: "block", marginBottom: "10px" }}>
                <input
                    type="checkbox"
                    checked={showCenterFilters}
                    onChange={() => setShowCenterFilters(!showCenterFilters)}
                />
                Climbing Centers
            </label>
            {showCenterFilters && (
                <div style={{ padding: "10px", marginBottom: "15px" }}>
                    <h3>By Features:</h3>
                    <label>
                        <input type="checkbox"
                               checked={requireMoonboard}
                               onChange={() => setRequireMoonboard(!requireMoonboard)}
                        />
                        Moonboard
                        <br />
                    </label>
                    <label>
                        <input type="checkbox"
                               checked={requireSpraywall}
                               onChange={() => setRequireSpraywall(!requireSpraywall)}/>
                        Spraywall
                        <br />
                    </label>
                    <label>
                        <input type="checkbox"
                               checked={requireLeadCenter}
                               onChange={() => setRequireLeadCenter(!requireLeadCenter)}/>
                        Lead
                        <br />
                    </label>
                    <label>
                        <input type="checkbox"
                               checked={requireBoulders}
                               onChange={() => setRequireBoulders(!requireBoulders)}/>
                        Boulders
                        <br />
                    </label>
                    <label>
                        <input type="checkbox"
                               checked={requireKilter}
                               onChange={() => setRequireKilter(!requireKilter)}/>
                        Kilter
                        <br />
                    </label>
                </div>
            )}

            <br/><br/><br/>
            {isLoggedIn? <button onClick={()=>{navigate("/addClimbingArea")}}>Add climbing area</button> : ""}
            {isLoggedIn? <button onClick={()=>{navigate("/addClimbingCenter")}}>Add climbing center</button> : ""}
        </div>
    );
};

export default FilterSidebar;