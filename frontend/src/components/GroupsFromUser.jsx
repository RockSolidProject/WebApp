import React, { useState, useEffect } from 'react';
import Group from "./Group.jsx";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const GroupsFromUser = () => {
    const [groups, setGroups] = useState({ owned: [], membered: [] });

    useEffect(() => {
        async function getGroups() {
            try {
                const res = await fetch(`${backendUrl}/groups/userGroups`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json' // Fix capitalization here
                    }
                });
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setGroups(data); // data should be { owned: [...], membered: [...] }
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
            <h2>Groups you own: </h2>
            {groups.owned.length === 0 ? <p>No groups owned.</p> : (
                groups.owned.map((group) => (
                    <Group group={group} key={group._id} />
                ))
            )}
            <h2>Groups you are a member of: </h2>
            {groups.membered.length === 0 ? <p>Not a member of any groups.</p> : (
                groups.membered.map((group) => (
                    <Group group={group} key={group._id} />
                ))
            )}
        </div>
    );
};

export default GroupsFromUser;
