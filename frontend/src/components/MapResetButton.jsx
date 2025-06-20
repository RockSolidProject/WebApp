import {useMap} from 'react-leaflet'
import {Button} from '@mui/material';

const MapResetButton = ({ bounds, defaultLatitude, defaultLongitude, defaultDistance, setLatitude, setLongitude, setDistance, setDistanceTmp,setDraftPolygon,setPolygon,setChoosingLocation  }) => {
    const map = useMap();
    const handleReset = () => {
        if (setChoosingLocation) setChoosingLocation(false)
        if (setLatitude && defaultLatitude) setLatitude(defaultLatitude)
        if (setLongitude && defaultLatitude) setLongitude(defaultLongitude)
        if (setDraftPolygon && setPolygon) {
            setPolygon([[45.35, 13.3],[45.35,16.6],[46.9,16.6],[46.9,13.3]])
            setDraftPolygon([])
        }
        if (setDistance && defaultDistance && setDistanceTmp) {
            setDistance(defaultDistance)
            setDistanceTmp(defaultDistance)
        }  

        map.fitBounds(bounds)
    };

    return (
        <Button
            id="map-reset-button"
            onClick={handleReset}
            variant="outlined"
            sx={{
                position: 'absolute', top: 10, right: 10, zIndex: 900,
                fontSize: 20,
                pt: 0,
                pb: 0,
                paddingLeft: 0.8,
                paddingRight: 0.8,
                minWidth: 'auto',
                background: '#f2f2f2', color: 'black',
                borderRadius: 1, border: '1px solid black',
                '&:hover': {
                    backgroundColor: '#e0e0e0'
                },
            }}
        >
            ↺
        </Button>
    );
}

export default MapResetButton