import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ClimbingAreaPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [area, setArea] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchArea() {
            try {
                const res = await fetch(`${backendUrl}/climbingAreas/${id}`);
                if (!res.ok) {
                    setError('Failed to fetch climbing area.');
                    return;
                }
                const data = await res.json();
                setArea(data);
            } catch (err) {
                setError('Error fetching climbing area.');
            }
        }
        async function getRoutes() {
            try {
                const res = await fetch(`${backendUrl}/climbingRoutes/byArea/${id}`);
                if(!res.ok) {
                    setError('Failed to fetch routes.');
                    return;
                }
                const data = await res.json();
                setRoutes(data);
            } catch (err){
                setError('Error getting routes.');
            }
        }
        fetchArea();
        getRoutes();
    }, [id]);



    if (error) return <div className="climbing-area-error">{error}</div>;
    if (!area) return <div className="climbing-area-loading">Loading...</div>;

    return (
        <div className="climbing-area-card">
            <h2 className="climbing-area-title">{area.name}</h2>
            <div className="climbing-area-info"><strong>Latitude:</strong> {area.latitude}</div>
            <div className="climbing-area-info"><strong>Longitude:</strong> {area.longitude}</div>
            <div className="climbing-area-info"><strong>Posted by:</strong> {area.postedBy?.username || 'Unknown'}</div>
            <h3 style={{marginTop: '24px', color: '#2d3a4a'}}>Routes</h3>
            {routes && routes.length > 0 ? (
                <ul className="climbing-area-routes-list">
                    {routes.map(route => (
                        <li key={route._id} className="climbing-area-route-item">
                            <strong
                                style={{ cursor: "pointer", color: "blue" }}
                                onClick={() => navigate(`/climbingRoutes/${route._id}`)}
                            >
                                {route.name}
                            </strong>
                            <span className="climbing-area-route-type"> ({route.type})</span>
                            {route.postedBy ? (
                                <span className="climbing-area-route-author">by {route.postedBy.username}</span>
                            ) : ''}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="climbing-area-info" style={{color: '#888'}}>No routes available.</p>
            )}

        </div>
    );
};

export default ClimbingAreaPage;