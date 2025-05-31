import React, { useState } from 'react';

const ClimbingCenterTable = ({ filteredCenters }) => {
    const [isTableVisible, setIsTableVisible] = useState(false);

    return (
        <div>
            <button onClick={() => setIsTableVisible(!isTableVisible)}>
                {isTableVisible ? "Hide Climbing Centers" : "Show Climbing Centers"}
            </button>
            {isTableVisible && (
                <table className="tabela">
                    <thead>
                    <tr>
                        <th>Climbing Center</th>
                        <th>Boulders</th>
                        <th>Routes</th>
                        <th>Moonboard</th>
                        <th>Spray Wall</th>
                        <th>Kilter</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCenters.map((center, index) => (
                        <tr key={index}>
                            <td>{center.name}</td>
                            <td>{center.hasBoulders ? "✔️" : ""}</td>
                            <td>{center.hasRoutes ? "✔️" : ""}</td>
                            <td>{center.hasMoonboard ? "✔️" : ""}</td>
                            <td>{center.hasSprayWall ? "✔️" : ""}</td>
                            <td>{center.hasKilter ? "✔️" : ""}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ClimbingCenterTable;