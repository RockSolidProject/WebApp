// src/App.jsx
import React, { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';

import Header from './components/Header';
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage'
import AddClimbingAreaPage from './components/AddClimbingAreaPage'
import AddClimbingCenterPage from './components/AddClimbingCenterPage.jsx'
import ClimbingAreaPage from './components/ClimbingAreaPage';
import ClimbingRoutePage from './components/ClimbingRoutePage';

const App = () => {
    return (
        <div>
            <Header />
            <main>
                 <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                     <Route path="/addClimbingArea" element={<AddClimbingAreaPage/>}/>
                     <Route path="/addClimbingCenter" element={<AddClimbingCenterPage/>}/>
                     <Route path="/climbingAreas/:id" element={<ClimbingAreaPage />} />
                     <Route path="/climbingRoutes/:id" element={<ClimbingRoutePage />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;