// src/App.jsx
import React, { useEffect } from 'react';
import Header from './components/Header';

const App = () => {
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users/test`)
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <div>
            <Header />
            <p>This is the main content of the app.</p>
        </div>
    );
};

export default App;