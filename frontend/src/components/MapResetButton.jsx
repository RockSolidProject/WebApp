import {useMap} from 'react-leaflet'

const MapResetButton = ({ center, zoom}) => {
    const map = useMap()
      const handleReset = () => {
        map.setView(center, zoom);
    };

    return (
        <button onClick={handleReset} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000,  fontSize: 20}}>
            ↺
        </button>
    );
}

export default MapResetButton