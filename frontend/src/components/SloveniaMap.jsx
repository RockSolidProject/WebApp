import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import leaflet from 'leaflet';

const SloveniaMap = ({ climbingAreas }) => {
    return (
        <MapContainer center={[46.14, 15.0153333]} zoom={8} minZoom={8} style={{ height: '400px', width: '600px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {/*<TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors & Carto'
            />*/}
            {climbingAreas.map((area) => {
                {/*iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",*/}
                const iconUrl = (area.routes?.length || 0) > 10 
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                : ((area.routes?.length || 0) > 5 
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'
                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png')
                return (
                    <Marker 
                        key={area._id} 
                        position={[area.latitude, area.longitude]}
                        icon={leaflet.icon({
                            iconUrl: iconUrl,
                            iconSize: [24, 30],
                            iconAnchor: [12, 30],
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