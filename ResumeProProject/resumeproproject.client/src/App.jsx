import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { UserProvider } from "./context/UserContext";

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
    < UserProvider>
      {/* Conditionally render Nav */}
      {!hideNavRoutes.includes(location.pathname) && <Nav />}

      <Routes>
        {/* Protected routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/templates" element={<TemplateSelection />} />
        <Route path="/editor" element={<ResumeEditor />} />
        <Route path="/insights" element={<ResumeInsights />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Unprotected routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </UserProvider>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}