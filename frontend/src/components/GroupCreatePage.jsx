import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function GroupCreatePage() {
    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to create a group.");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/groups`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, isPrivate, description })
            });
            if(res.status === 401 || res.status === 403) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                setError("")
                navigate("/login")
                return
            }

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to create group");
            }

            const createdGroup = await res.json();
            navigate(`/groupDetail/${createdGroup._id}`);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2>Create a New Group</h2>

            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                />
            </label>

            <br />

            <label>
                Private Group:
                <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
            </label>

            <br />

            <label>
                Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            <br />

            <button type="submit">Create Group</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default GroupCreatePage;