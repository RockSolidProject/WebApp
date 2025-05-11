// src/App.jsx
import React, { useEffect } from 'react';
import Header from './components/Header';

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
            <p>This is the main content of the app.</p>
        </div>
    );
};

export default App;