// src/App.jsx
import React, {useEffect} from 'react';
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
import AddRoutePage from './components/AddRoutePage';
import GroupsPage from "./components/GroupsPage.jsx";
import GroupDetailPage from "./components/GroupDetailPage.jsx";
import GroupCreatePage from "./components/GroupCreatePage.jsx";
import GroupsFromUser from "./components/GroupsFromUser.jsx";
import EventsPage from "./components/EventsPage.jsx";
import EventDetailPage from "./components/EventDetailPage.jsx";
import EventAddPage from "./components/EventAddPage.jsx";

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
                    <Route path="/createGroup" element={<GroupCreatePage/>}/>
                    <Route path="/addClimbingArea" element={<AddClimbingAreaPage/>}/>
                    <Route path="/addClimbingCenter" element={<AddClimbingCenterPage/>}/>
                    <Route path="/climbingAreas/:id" element={<ClimbingAreaPage/>}/>
                    <Route path="/climbingRoutes/:id" element={<ClimbingRoutePage/>}/>
                    <Route path="/climbingAreas/:id/addRoute" element={<AddRoutePage />} />
                    <Route path="/userGroups" element={<GroupsFromUser/>}/>
                    <Route path="/events" element={<EventsPage/>}/>
                    <Route path="/event/:id" element={<EventDetailPage/>}/>
                    <Route path={"/eventAdd"} element={<EventAddPage/>}/>
                </Routes>
            </main>
        </div>
    );
};

export default App;