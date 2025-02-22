import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from './context/ThemeContext';

import Nav from './components/Nav';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import TemplateSelection from './pages/TemplateSelection';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumePreview from './pages/ResumePreview';
import ResumeInsights from './pages/ResumeInsights';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Help from './pages/Help';

import './App.css';

function App() {
  const location = useLocation();
  
  // Define routes where Nav should be hidden
  const hideNavRoutes = [ "/login", "/signup", "/help" ];
  
  return (
    < UserProvider>
      <ThemeProvider>
        {/* Conditionally render Nav */}
        {!hideNavRoutes.includes(location.pathname) && <Nav />}

        {/* Toast Container for toast alerts */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          closeOnClick
          newestOnTop
        />

        <Routes>
          {/* Authorized routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/templates" element={<TemplateSelection />} />
          <Route path="/builder/:templateId/:resumeId?" element={<ResumeBuilder />} />
          <Route path="/preview/:resumeId" element={<ResumePreview />} />
          <Route path="/insights/:resumeId" element={<ResumeInsights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/help" element={<Help />} />
          
          {/* Unauthorized routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </ThemeProvider>
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