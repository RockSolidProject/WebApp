import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const RegisterPage = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault()

        try {
            const res =  await fetch(`${backendUrl}/users/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, username, password})
            })

            const data = await res.json();

            if (res.status === 409) {
                setError("That username is already taken.")
                return
            }
            if (!res.ok) {
                setError("Registration failed.")
                return
            }

            navigate("/login")
        }
        catch (error) {
            setError("Error while registering")
        }

    }

    return (
        <>
            <form onSubmit={handleRegister}>
                <h2>Login</h2>
                <div>
                    <label>
                        Email: <br />
                        <input type="email" value={email}
                        onChange={e => setEmail(e.target.value)} required
                    />
                    </label>
                </div>
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

                <button type="submit">Register</button>
            </form>
            {error ? <p style={{color: "red"}}>{error}</p> : ""}
        </>
    );
};

export default RegisterPage;