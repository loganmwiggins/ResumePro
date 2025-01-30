import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
  return (
    <BrowserRouter>
        <div>
            <Nav />

            {/* Content changes based on route */}
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
        </div>
    </BrowserRouter>
  )
}

export default App;