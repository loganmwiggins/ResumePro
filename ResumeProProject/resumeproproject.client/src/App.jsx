import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import './App.css';
import Nav from './components/Nav';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import TemplateSelection from './pages/TemplateSelection';
import ResumeEditor from './pages/ResumeEditor';
import ResumeInsights from './pages/ResumeInsights';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  const location = useLocation();
  
  // Define routes where Nav should be hidden
  const hideNavRoutes = ["/login", "/signup"];
  
  return (
    <>
      {/* Conditionally render Nav */}
      {!hideNavRoutes.includes(location.pathname) && <Nav />}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/templates" element={<TemplateSelection />} />
        <Route path="/editor" element={<ResumeEditor />} />
        <Route path="/insights" element={<ResumeInsights />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}