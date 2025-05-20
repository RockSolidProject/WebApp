import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LoginPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault()

        try {

            const res = await fetch(`${backendUrl}/users/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
            })

            const data = await res.json()

            if (res.status === 401) {
                setError("Invalid username or password")
                return
            }
            if (!res.ok) {
                setError("Error logging in.")
                return
            }
            setError("")
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.userData))
            navigate("/")
        }
        catch (error) {
            setError("Error while loggin in")
        }
    }

    return (
        <>
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <div>
                <label>
                    Username: <br />
                    <input type="text" value={username}
                    onChange={e => setUsername(e.target.value)} required
                />
                </label>
            </div>
            <div>
                <label>
                Password: <br />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                </label>
            </div>

            <button type="submit">Login</button>
        </form>
        {error ? <p style={{color: "red"}}>{error}</p> : ""}
        </>
    );
};

export default LoginPage;