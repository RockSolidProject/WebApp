// src/components/Header.jsx
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);
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
            <a href="/" style={{ textDecoration: 'none', color: 'black' }}>Home</a>
            {isLoggedIn ? 
                <div style={{ position: 'relative' }}>
                    <span onClick={() => setShowMenu(!showMenu)}>
                        {user.username}
                        <img src={image} alt="Profile picture" width="30" height="30"></img>
                    </span>

                    {showMenu ? 
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
                            <button onClick={() => navigate("/profile")} style={{ display: 'block', width: '100%', marginBottom: '5px' }}> Profile </button>
                            <button onClick={handleLogout} style={{ display: 'block', width: '100%', background: "#faa" }}> Logout</button>
                        </div>
                    : ""}
                </div>:
                <>
                    <a href="/login" style={{ textDecoration: 'none', color: 'black' }}>Login</a>
                    <a href="/register" style={{ textDecoration: 'none', color: 'black' }}>Register</a>
                </>
            }
            
        </nav>
    );
};

export default Header;