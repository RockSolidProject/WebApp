import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle, Polygon } from 'react-leaflet';
import MapResetButton from './MapResetButton';
import leaflet from 'leaflet';
import {Slider, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MarkerClusterGroup from 'react-leaflet-cluster';
import React, {useState} from 'react';

const SloveniaMap = ({ climbingAreas, climbingCenters, latitude, longitude, setLatitude,
    setLongitude, setDistance, choosingLocation, setChoosingLocation,
    isCircleMode, setIsCircleMode, polygon, setPolygon
}) => {
    const navigate = useNavigate();
    const bounds = [[45.37, 13.3],[46.89, 16.6]]

    const [draftPolygon, setDraftPolygon] = useState([]);
    const [distanceTmp, setDistanceTmp] = useState(135)

    function ClickHandler({ setLatitude, setLongitude, setChoosingLocation }) {
        useMapEvents({
            click(e) {
                if (e.originalEvent?.target?.id == "map-reset-button"){
                    return
                }

                if (isCircleMode) {
                    setLatitude(e.latlng.lat);
                    setLongitude(e.latlng.lng);
                    setChoosingLocation(false)
                }
                else {
                    setDraftPolygon((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
                }
            }
        });
        return null;
    }

    return (
    <div style={{ width: "100%", height: "100%" }}>
        <MapContainer 
                bounds={bounds}
                maxBounds={[[45.37, 13.3],[46.89, 16.6]]}
                style={{ width: '100%', aspectRatio: "3 / 2" }}
                doubleClickZoom={false}
                maxBoundsViscosity={1}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {/*<TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors & Carto'
            />*/}
            <MapResetButton bounds={bounds} defaultLatitude={46.1199444} defaultLongitude={15} defaultDistance={135}
                setLatitude={setLatitude} setLongitude={setLongitude} setDistance={setDistance} setDistanceTmp={setDistanceTmp}
                setChoosingLocation={setChoosingLocation} setPolygon={setPolygon} setDraftPolygon={setDraftPolygon}
            />

            {!choosingLocation ? "" : <ClickHandler setLatitude={setLatitude} setLongitude={setLongitude}setChoosingLocation={setChoosingLocation} /> }

            {isCircleMode ?
                <>
                    {/*Circle query*/}
                    <Marker
                        position={[latitude, longitude]}
                        icon={leaflet.icon({
                            iconUrl: "/markers/marker_blue.png",
                            iconSize: [8, 8],
                            })}
                        >
                        <Popup>Center of search</Popup>
                    </Marker>

                    <Circle
                        center={[latitude, longitude]}
                        radius={distanceTmp * 1000}
                        pathOptions={{
                            color: 'blue',
                            fillColor: 'blue',
                            fillOpacity: 0.07
                        }}
                    />
                    {/*Circle query*/}
                </>
            :
                <>
                    <Polygon
                        positions={polygon}
                        pathOptions={{
                        color: 'blue',
                        fillColor: 'blue',
                        fillOpacity: 0.15,
                        dashArray: "4 4"
                        }}
                    />

                    {draftPolygon.length > 0 && draftPolygon.map((pos, idx) => (
                    <Marker
                        key={`draft-${idx}`}
                        position={pos}
                        icon={leaflet.icon({
                        iconUrl: "/markers/marker_blue.png", // or a small dot
                        iconSize: [8, 8],
                        })}
                    />
                    ))}

                    {draftPolygon.length >= 2 && (
                        <Polygon
                            positions={draftPolygon}
                            pathOptions={{
                            color: 'purple',
                            fillColor: 'purple',
                            fillOpacity: 0.2,
                            dashArray: "4 4"
                            }}
                        />
                    )}
                </>
            }

            <MarkerClusterGroup showCoverageOnHover={false}>
            {climbingAreas.map((area) => {
                const iconUrl = (area.routes?.length || 0) > 10
                ? '/markers/marker_area_orange.png'
                : ((area.routes?.length || 0) > 5
                ? '/markers/marker_area_yellow.png'
                : '/markers/marker_area_beige.png')
                return (
                    <Marker 
                        key={area._id}
                        position={[area.latitude, area.longitude]}
                        icon={leaflet.icon({
                            iconUrl: iconUrl,
                            iconSize: [24, 30],
                            iconAnchor: [12, 30],
                            shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
                            popupAnchor: [0, -34],
                            shadowSize: [40, 30]
                        })}
                        >
                            <Popup>
                                <div
                                    style={{ cursor: "pointer", fontWeight: "bold", color: "blue" }}
                                    onClick={() => navigate(`/climbingAreas/${area._id}`)}
                                >
                                    {area.name}
                                </div>
                                <div>{area.routes?.length || 0} routes</div>
                            </Popup>
                        </Marker>
                    );
                })}

                {climbingCenters.map((center) => (
                    <Marker
                        key={center._id}
                        position={[center.latitude, center.longitude]}
                        icon={leaflet.icon({
                            iconUrl: '/markers/marker_center.png',
                            iconSize: [24, 30],
                            iconAnchor: [12, 30],
                            shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
                            popupAnchor: [0, -34],
                            shadowSize: [40, 30]
                        })}
                    >

                        <Popup>
                            <div
                                style={{ cursor: "pointer", fontWeight: "bold", color: "blue"}}
                                onClick={() => navigate(`/climbingCenters/${center._id}`)}
                            >
                                {center.name}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
        <div 
            style={{
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: "center",
                justifyContent: "flex-start",
                gap: '20px',
                padding: '10px',
                background: '#f2f2f2',
                border: '1px solid black',
                width: "100%",
                fontSize: 16
            }}  
        >   
            <Button
                variant="outlined"
                size="small"
                onClick={() => setIsCircleMode(!isCircleMode)}
                sx={{
                    border: "2px solid black",
                    color: "black",
                    fontSize: 20,
                    marginLeft: 1,
                    paddingRight: 1,
                    paddingBottom: 0,
                    paddingTop: 0,
                    paddingLeft: 1,
                    minWidth: "2em",
                    '&:hover': {
                        backgroundColor: 'grey.400',
                    },
                }}
            >
                {!isCircleMode ? "⭘" : "⬠"}
            </Button>
            {isCircleMode ?
                <>
                {/*Circle menu*/}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setChoosingLocation(!choosingLocation)}
                        sx={{
                            border: "2px solid black",
                            color: "black",
                            fontSize: 20,
                            marginLeft: 0,
                            paddingRight: 0.8,
                            paddingBottom: 0,
                            paddingTop: 0,
                            paddingLeft: 1,
                            minWidth: "auto",
                            background: choosingLocation ? "#009879" : "#f2f2f2",
                            '&:hover': {
                                backgroundColor: 'grey.400',
                            },
                        }}
                    >
                        📌
                    </Button>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <div>{distanceTmp}km</div>
                        <Slider
                            min={5} max={135} step={1}
                            value={distanceTmp}
                            onChangeCommitted={(e, value) => setDistance(value)}
                            onChange={(e) => setDistanceTmp(Number(e.target.value))}
                            size='small'
                            sx={{ width: 150 }}
                        />
                    </div>
                    {/*Circle menu*/}
                </>
                :
                <>
                    <div style={{alignItems: "center", display: "flex", gap: 10}}>
                        {!choosingLocation ?
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setChoosingLocation(!choosingLocation)}
                                sx={{
                                    border: "2px solid black",
                                    color: "black",
                                    fontSize: 20,
                                    marginLeft: 0,
                                    paddingRight: 0.8,
                                    paddingBottom: 0,
                                    paddingTop: 0,
                                    paddingLeft: 1,
                                    minWidth: "auto",
                                    '&:hover': {
                                        backgroundColor: 'grey.400',
                                    },
                                }}
                            >
                                📌
                            </Button>
                        :
                        <>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {setDraftPolygon([]); setChoosingLocation(false) }}
                                sx={{
                                    border: "2px solid black",
                                    color: "black",
                                    fontSize: 16,
                                    marginLeft: 0,
                                    padding: 0.3,
                                    background: "#e86051",
                                    '&:hover': {
                                        backgroundColor: '#ba3b11',
                                        color: "white"
                                    },
                                }}
                            >
                                Prekliči
                            </Button>

                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    if (draftPolygon.length >= 3) {
                                        setPolygon(draftPolygon);
                                        setDraftPolygon([]);
                                        setChoosingLocation(false)
                                    }
                                }}
                                disabled={draftPolygon.length < 3}
                                sx={{
                                    border: "2px solid black",
                                    color: "black",
                                    fontSize: 16,
                                    marginLeft: 0,
                                    padding: 0.3,
                                    background: "#93fa91",
                                    cursor: draftPolygon.length < 3 ? "not-allowed" : "pointer",
                                    opacity: draftPolygon.length < 3 ? 0.6 : 1,
                                    '&:hover': {
                                        backgroundColor: '#3b8f0e',
                                        color: "white"
                                    },
                                }}
                            >
                                Shrani
                            </Button>
                        </>
                        }

                    </div>
                </>
            }
        </div>
    </div>);
};

export default SloveniaMap;