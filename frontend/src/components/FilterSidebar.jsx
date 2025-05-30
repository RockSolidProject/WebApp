import React, {useState} from 'react';

const FilterSidebar = ({requireBoulder, setRequireBoulder, requireLead, setRequireLead, requireUrban, setRequireUrban, requiredNumberOfRoutes, setRequiredNumberOfRoutes,
      distanceTmp, setDistanceTmp, setDistance, latitude, setLatitude, longitude, setLongitude, choosingLocation, setChoosingLocation, isLoggedIn, navigate, climbingAreas, setRequireMoonboard, requireMoonboard,
      setRequireSpraywall, requireSpraywall, setRequireLeadCenter, requireLeadCenter, setRequireBoulders, requireBoulders, setRequireKilter, requireKilter, setShowClimbingAreas,
      showClimbingAreas, showClimbingCenters, setShowClimbingCenters
}) => {
    return (
        <div style={{
            width: "250px",
            maxWidth: "20%",
            padding: "20px",
            height: "100%",
            marginRight: "15px",
            backgroundColor: "grey"}}>
            <h2>Filters:</h2>
            <label style={{ display: "block", marginBottom: "5px" }}>
                <input
                    type="checkbox"
                    checked={showClimbingAreas}
                    onChange={() => setShowClimbingAreas(!showClimbingAreas)}
                />
                <span style={{ fontSize: "1.3em", fontWeight: 650 }}>Zunanja plezališča</span>
            </label>

            {showClimbingAreas && (
                <div style={{ paddingLeft: "2em" }}>
                    <span style={{ fontSize: "1.2em", fontWeight: 550 }}>Vsebuje: </span><br/>
                    <div style={{ paddingLeft: "1em" }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={requireBoulder}
                                onChange={() => setRequireBoulder(!requireBoulder)}
                            />
                            Balvane
                            <br />
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={requireLead}
                                onChange={() => setRequireLead(!requireLead)}
                            />
                            Športne poti
                            <br />
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={requireUrban}
                                onChange={() => setRequireUrban(!requireUrban)}
                            />
                            Urbane poti
                            <br />
                        </label>
                    </div>
                    <span style={{ fontSize: "1.2em", fontWeight: 550 }}>Število poti: </span><br/>
                    <div style={{ paddingLeft: "1em" }}>
                    <div>Vsaj: {requiredNumberOfRoutes}</div>
                        <input
                            type="range"
                            min={0}
                            max={Math.max(1, ...climbingAreas.map(a => a.routes?.length || 0))}
                            value={requiredNumberOfRoutes}
                            onChange={(e) => setRequiredNumberOfRoutes(Number(e.target.value))}
                        />
                    </div>
                </div>
            )}

            <label style={{ display: "block", marginBottom: "10px" }}>
                <input
                    type="checkbox"
                    checked={showClimbingCenters}
                    onChange={() => setShowClimbingCenters(!showClimbingCenters)}
                />
                <span style={{ fontSize: "1.3em", fontWeight: 650 }}>Plezalni centri</span>
            </label>
            {showClimbingCenters && (
                <div style={{ paddingLeft: "2em" }}>
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