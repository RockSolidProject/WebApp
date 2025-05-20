// src/App.jsx
import React, { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';

import Header from './components/Header';
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage'

const App = () => {
    useEffect(() => {
        fetch('http://localhost:3001/users/test')
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <div>
            <Header />
            <main>
                 <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                </Routes>
            </main>
        </div>
    );
};

export default App;