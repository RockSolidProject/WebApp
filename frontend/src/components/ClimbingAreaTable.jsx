import React, { useState } from 'react';

const ClimbingAreaTable = ({ filteredAreas }) => {
    const [isTableVisible, setIsTableVisible] = useState(false);

    return (
        <div>
            <button onClick={() => setIsTableVisible(!isTableVisible)}>
                {isTableVisible ? "Skrij zunanja plezališča" : "Pokaži zunanja plezališča"}
            </button>
            {isTableVisible && (
                <table>
                    <thead>
                    <tr>
                        <th>Plezališče</th>
                        <th>Število poti</th>
                        <th>Vrste poti</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAreas.map((climbingArea, index) => (
                        <tr key={index}>
                            <td>{climbingArea.name}</td>
                            <td>{climbingArea.routes ? climbingArea.routes.length : 0}</td>
                            <td>{(climbingArea.routes && climbingArea.routes.length > 0) ? (
                                [...new Set(climbingArea.routes.map(route => route.type))].join(",")
                            ) : "_"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ClimbingAreaTable;