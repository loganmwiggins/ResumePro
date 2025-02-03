import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/UserContext"; 

import '../stylesheets/Nav.css';

function Nav() {
    const { user, loading } = useUser();
    const navigate = useNavigate();

    const handleTitleClick = () => { navigate("/home"); };
    const handleProfileClick = () => { navigate("/profile"); };
    const handleLoginClick = () => { navigate("/login"); }

    return (
        <div className="nav-container">
            <div className="main-row">
                <div className="title" onClick={handleTitleClick} title="Go Home">
                    <img src="assets/icons/resume-logo.svg" draggable="false" />
                    <h3>ResumePro</h3>
                </div>

                <div className="directory">
                    {loading ? (
                        <div className="loading-spinner"></div>  // Replace with a spinner or skeleton
                    ) : user ? (
                        <button className="user-btn" onClick={handleProfileClick} title="Profile">
                            <img src="assets/icons/user.svg" draggable="false" />
                            {/* <span>{user.firstName}</span> */}
                            <img src="assets/icons/angle-down.svg" draggable="false" />
                        </button>
                    ) : (
                        <button onClick={handleLoginClick}>
                            <span>Login</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Nav;