import {useMap} from 'react-leaflet'

const MapResetButton = ({ bounds }) => {
    const map = useMap();
    const handleReset = () => {
        map.fitBounds(bounds)
    };

    return (
        <button type="button"  id="map-reset-button" onClick={handleReset} 
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000,  
                fontSize: 20, padding: 0, paddingLeft: 6, paddingRight: 6, background: "#f2f2f2", color: "black",
                borderRadius: 0, border: "1px solid black"
            }}>
            ↺
        </button>
    );
}

export default MapResetButton