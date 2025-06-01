import React, { useState, useEffect } from 'react';
import Group from "./Group.jsx";
import {Link} from "react-router-dom";


const GroupsPage = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        async function getGroups() {
            try {
                const res = await fetch('http://localhost:3001/groups');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setGroups(data);
            } catch (error) {
                console.error(error);
            }
        }

        getGroups();
    }, []);

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <Link
                    to="/createGroup"
                    style={{
                        textDecoration: 'none',
                        color: 'white',
                        backgroundColor: '#007bff',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        display: 'inline-block'
                    }}
                >
                    Create a Group
                </Link>
            </div>

            {groups.map((group) => (
                <Group group={group} key={group._id} />
            ))}
        </div>
    );

};

export default GroupsPage;
