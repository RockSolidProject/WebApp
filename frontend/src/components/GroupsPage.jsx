import { useState, useEffect } from 'react';
import Group from "./Group.jsx";

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
        <>
            {groups.map((group) => (
                <Group group={group} key={group.id} />
            ))}
        </>
    );
};

export default GroupsPage;
