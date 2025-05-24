import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import React, {useState} from 'react';
import MapResetButton from './MapResetButton';
import leaflet from 'leaflet';

const SloveniaMap = ({ climbingAreas, latitude, longitude, setLatitude, setLongitude, distance, choosingLocation, setChoosingLocation }) => {
    const center = [46.14, 15.0153333]

    function ClickHandler({ setLatitude, setLongitude, setChoosingLocation }) {
        useMapEvents({
            click(e) {
                setLatitude(e.latlng.lat);
                setLongitude(e.latlng.lng);
                setChoosingLocation(false)
            }
        });
        return null;
    }

    return (
        <MapContainer center={center} zoom={8} minZoom={8} maxBounds={[[45, 13.2],[47.3, 17.0]]} 
            maxBoundsViscosity={1.0} style={{ height: '400px', width: '600px' }}
            doubleClickZoom={false} >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {/*<TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors & Carto'
            />*/}
            <MapResetButton center={center} zoom={8}/>

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
                radius={distance * 1000}
                pathOptions={{
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.07
                }}
            />

            {climbingAreas.map((area) => {
                {/*iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",*/}
                /*const iconUrl = (area.routes?.length || 0) > 10 
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                : ((area.routes?.length || 0) > 5 
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'
                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png')*/
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
        </MapContainer>
    );
};

export default SloveniaMap;