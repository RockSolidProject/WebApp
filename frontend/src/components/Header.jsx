// src/components/Header.jsx
import React from 'react';

const Header = () => {
    return (
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-around' }}>
            <a href="/" style={{ textDecoration: 'none', color: 'black' }}>Home</a>
            <a href="/login" style={{ textDecoration: 'none', color: 'black' }}>Login</a>
            <a href="/register" style={{ textDecoration: 'none', color: 'black' }}>Register</a>
        </nav>
    );
};

export default Header;