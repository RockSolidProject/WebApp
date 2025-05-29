// src/App.jsx
import React, {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';

import Header from './components/Header';
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage'
import AddClimbingAreaPage from './components/AddClimbingAreaPage'
import GroupsPage from "./components/GroupsPage.jsx";
import GroupDetailPage from "./components/GroupDetailPage.jsx";
import CreateGroupPage from "./components/CreateGroupPage.jsx";

const App = () => {
    return (
        <div>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/addClimbingArea" element={<AddClimbingAreaPage/>}/>
                    <Route path="/groups" element={<GroupsPage/>}/>
                    <Route path="/groupDetail/:id" element={<GroupDetailPage/>}/>
                    <Route path="/createGroup" element={<CreateGroupPage/>}/>
                </Routes>
            </main>
        </div>
    );
};

export default App;