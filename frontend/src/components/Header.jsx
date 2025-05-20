// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const isLoggedIn = (localStorage.getItem("token") != null && localStorage.getItem("user") != null)
    const user = JSON.parse(localStorage.getItem("user"))   
    let image = ""
    if (user) {
        image = "http://localhost:3001/"+user.avatar
    }

    function handleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/");
    }

    return (
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-around' }}>
            {isLoggedIn ? 
                <>
                    <a href="/" style={{ textDecoration: 'none', color: 'black' }}>Home</a>
                    <span>User: {user.username}
                    <img src={image} alt="Profile picture" width="30" height="30"></img></span>
                    <button onClick={handleLogout}>Logout</button>
                </>:
                <>
                    <a href="/" style={{ textDecoration: 'none', color: 'black' }}>Home</a>
                    <a href="/login" style={{ textDecoration: 'none', color: 'black' }}>Login</a>
                    <a href="/register" style={{ textDecoration: 'none', color: 'black' }}>Register</a>
                </>
            }
            
        </nav>
    );
};

export default Header;