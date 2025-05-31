import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import MapResetButton from './MapResetButton';
import leaflet from 'leaflet';
import {Collapse,Box,Typography,FormControlLabel,Checkbox,Slider,Divider,Button,Stack, useMediaQuery, useTheme} from '@mui/material';

const SloveniaMap = ({ climbingAreas, climbingCenters, latitude, longitude, setLatitude, setLongitude, distanceTmp,  setDistanceTmp,  setDistance, choosingLocation, setChoosingLocation }) => {
    const bounds = [[45.37, 13.3],[46.89, 16.6]]

    function ClickHandler({ setLatitude, setLongitude, setChoosingLocation }) {
        useMapEvents({
            click(e) {
                if (e.originalEvent?.target?.id == "map-reset-button"){
                    return
                }

                setLatitude(e.latlng.lat);
                setLongitude(e.latlng.lng);
                setChoosingLocation(false)
            }
        });
        return null;
    }

    return (
    <div style={{ /*width: "600px", height: "400px"*/ width: "100%", height: "100%" }}>
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
            <MapResetButton bounds={bounds} defaultLatitude={46.1199444} defaultLongitude={15} defaultDistance={135} setLatitude={setLatitude} setLongitude={setLongitude} setDistance={setDistance} setDistanceTmp={setDistanceTmp}/>

            {!choosingLocation ? "" : <ClickHandler setLatitude={setLatitude} setLongitude={setLongitude}setChoosingLocation={setChoosingLocation} /> }

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
                            <strong>{area.name}</strong><br/>
                            {area.routes?.length || 0} routes
                        </Popup>
                    </Marker>
                )
            })}
            {climbingCenters.map((center) => {
                const iconUrl = '/markers/marker_center.png'
                return (
                    <Marker
                        key={center._id}
                        position={[center.latitude, center.longitude]}
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
                            <strong>{center.name}</strong><br/>
                        </Popup>
                    </Marker>
                )
            })}
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
            <div style={{alignItems: "center", display: "flex"}}>
                <button onClick={() => setChoosingLocation(!choosingLocation)}
                    style={{ 
                    fontSize: 20, padding: 2, background: choosingLocation ? "#009879" : "#f2f2f2", color: "black",
                    borderRadius: 0, border: "2px solid black", marginLeft: 10
                    }}>
                    📌
                </button>
            </div>
            
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
                    onTouchEnd={() => setDistance(distanceTmp)}
                    onMouseUp={() => setDistance(distanceTmp)}
                    onChange={(e) => setDistanceTmp(Number(e.target.value))}
                    size='small'
                    sx={{ width: 150 }}
                /> 
            </div>
        </div>
    </div>);
};

export default SloveniaMap;