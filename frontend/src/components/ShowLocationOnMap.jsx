import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import leaflet from 'leaflet';

const ShowLocationOnMap = ({ latitude, longitude, name = "Location" }) => {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
        return <div>Invalid coordinates</div>;
    }

    const position = [latitude, longitude];
    const bounds = [[45.37, 13.3], [46.89, 16.6]];

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <MapContainer
                center={position}
                zoom={12}
                bounds={bounds}
                style={{ height: '100%', width: '100%' }}
                maxBounds={bounds}
                maxBoundsViscosity={1}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <Marker
                    position={position}
                    icon={leaflet.icon({
                        iconUrl: "/markers/default-marker.png",
                        iconSize: [25, 42],
                        iconAnchor: [12.5, 42],
                        shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
                        popupAnchor: [0, -34],
                        shadowSize: [40, 30]
                    })}
                >
                    <Popup>{name}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default ShowLocationOnMap;