import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import MapResetButton from './MapResetButton';
import leaflet from 'leaflet';

const SloveniaEmptyMap = ({ latitude, longitude, setLatitude, setLongitude }) => {
    const bounds = [[45.37, 13.3],[46.89, 16.6]]

    return (
        <MapContainer
            bounds={bounds}
            maxBounds={[[45.37, 13.3],[46.89, 16.6]]}
            style={{ width: '100%', aspectRatio: "3 / 2" }}
            doubleClickZoom={false}
            maxBoundsViscosity={1}
        >

            <MapResetButton bounds={bounds} setLatitude={setLatitude} setLongitude={setLongitude} defaultLatitude={46.1199444} defaultLongitude={15}/>

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[latitude, longitude]}
                    icon={leaflet.icon({
                        iconUrl: "/markers/default-marker.png",
                        iconSize: [25, 42],
                        iconAnchor: [12.5, 42],
                        shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
                        popupAnchor: [0, -34],
                        shadowSize: [40, 30]
                    })}
            >
                <Popup>Center of search</Popup>
            </Marker>
        </MapContainer>
    )

};

export default SloveniaEmptyMap;