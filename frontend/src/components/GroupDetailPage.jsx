import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function GroupDetailPage() {
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getGroup() {
            try {
                const res = await fetch(`${backendUrl}/groups/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch group");
                const data = await res.json();
                setGroup(data);
            } catch (err) {
                console.error(err);
                setError("Could not fetch group.");
            }
        }

        getGroup();
    }, [id]);

    async function joinGroup() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const res = await fetch(`${backendUrl}/groups/join`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    groupId: group._id,
                }),
            });

            if (!res.ok) {
                setError("Error joining group");
                return;
            }

            setError("");
            // optionally, re-fetch group to get updated member list
        } catch (e) {
            setError(e.message || "An error occurred");
        }
    }

    if (!group) return <p>Loading group...</p>;

    return (
        <div>
            <h1>Name: {group.name}</h1>
            {group.description && <h3>Description: {group.description}</h3>}
            {group.owner && <p>Owner: {group.owner.username}</p>}
            {group.isPrivate&&<h3>Private 🔒</h3>}
            {!group.isPrivate && (
                <>
                    <button onClick={joinGroup}>Join</button>
                    <h4>Members:</h4>
                    <ul>
                        {group.members?.map((member) => (
                            <li key={member._id}>
                                <p>{member.member.username}</p>
                            </li>
                        ))}
                    </ul>

                </>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default GroupDetailPage;
