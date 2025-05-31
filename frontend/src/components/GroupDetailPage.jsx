import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import GroupAddMember from "./GroupAddMember.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;


function GroupDetailPage() {
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {


        getGroup();
    }, [id]);

    async function getGroup() {
        try {
            const res = await fetch(`${backendUrl}/groups/${id}`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!res.ok) {
                setError("Error fetching group.");
                return;
            }

            const data = await res.json();
            setGroup(data);
        } catch (err) {
            console.error(err);
            setError("Could not fetch group.");
        }
    }

    async function handleAddMember() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return
            }
            if (!selected) {
                setError("Missing member to add")
                return;
            }
            const res = await fetch(`${backendUrl}/groups/add`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    group: group._id,
                    member: selected
                }),
            })
            if (res.status === 401 || res.status === 403) {
                navigate("/login");
                return;
            } else if (!res.ok) {
                setError(`Issue adding a member ${res.error || res.message}`)
            }
            await getGroup()
            setSelected(null);
        } catch (e) {
            setError(`Error adding member: ${e || e.message}`);
            setSelected(null);
        }
    }

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

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!res.ok) {
                setError(`Error joining group: ${res.error || res.message || "undefined"}`);
                return;
            }

            setError("");
            await res.json();
            await getGroup()
        } catch (e) {
            setError(e.message || "An error occurred");
        }
    }

    if (!group) return <p>Loading group...</p>;

    //const isOwner = true;

    return (
        <div>
            <h1>Name: {group.name}</h1>
            {group.description && <h3>Description: {group.description}</h3>}
            {group.owner && <h3>Owner: {group.owner.username}</h3>}

            {group.isPrivate && !group.isMember && !group.isOwner ? (
                <h3>Private 🔒</h3>
            ) : (
                <>
                    {!group.isMember && !group.isPrivate && (
                        <button onClick={joinGroup}>Join Group</button>
                    )}

                    {group.isMember || group.isOwner && (
                        <>
                            {group.isOwner && (
                                <>
                                    <GroupAddMember onUserSelect={(user) => setSelected(user?.value)}/>
                                    <button onClick={handleAddMember}>Add Member</button>
                                </>
                            )}
                        </>
                    )}
                    <h4>Members:</h4>
                    <ul>
                        {group.members?.map((member) => (
                            <li key={member._id}>{member.member.username}</li>
                        ))}
                    </ul>


                </>
            )}

            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    );
}

export default GroupDetailPage;
