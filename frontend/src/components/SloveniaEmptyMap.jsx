import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';

const SloveniaEmptyMap = ({ latitude, longitude, setLatitude, setLongitude }) => {

    function ClickHandler({ setLatitude, setLongitude}) {
        useMapEvents({
            click(e) {
                setLatitude(e.latlng.lat);
                setLongitude(e.latlng.lng);
            }
        });
        return null;
    }

    return (
        <MapContainer
                bounds={[[45.37, 13.3],[46.89, 16.6]]}
                maxBounds={[[45.37, 13.3],[46.89, 16.6]]}
                style={{ height: '400px', width: '600px' }}
                doubleClickZoom={false}
                maxBoundsViscosity={1}
            >

            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
            />
            
            <ClickHandler setLatitude={setLatitude} setLongitude={setLongitude}/>

            <Marker position={[latitude, longitude]}>
                <Popup>Center of search</Popup>
            </Marker>
        </MapContainer>
    )

};

export default SloveniaEmptyMap;