import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem("token") && localStorage.getItem("user");
    const user = isLoggedIn ? JSON.parse(localStorage.getItem("user")) : null;
    const image = user ? backendUrl + user.avatar : "";

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-around' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Home</Link>
            <Link to="/groups" style={{ textDecoration: 'none', color: 'black' }}>Groups</Link>

            {isLoggedIn ? (
                <div style={{ position: 'relative' }}>
                    <span onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }}>
                        {user.username}
                        <img src={image} alt="Profile" width="30" height="30" style={{ marginLeft: '8px' }} />
                    </span>

                    {showMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            backgroundColor: '#fff',
                            border: '1px solid #aaa',
                            padding: '10px',
                            borderRadius: '4px',
                            zIndex: 1,
                        }}>
                            <button onClick={() => navigate("/profile")} style={{ display: 'block', width: '100%', marginBottom: '5px' }}>Profile</button>
                            <button onClick={() => navigate("/userGroups")} style={{ display: 'block', width: '100%', marginBottom: '5px' }}>My Groups</button>
                            <button onClick={handleLogout} style={{ display: 'block', width: '100%', background: "#faa" }}>Logout</button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>Login</Link>
                    <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>Register</Link>
                </>
            )}
        </nav>
    );
};

export default Header;
