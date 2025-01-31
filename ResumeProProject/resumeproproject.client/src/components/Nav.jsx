import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/Nav.css';

function Nav() {
    const navigate = useNavigate();

    const handleTitleClick = () => {
        navigate("/home");
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    return (
        <div className="nav-container">
            <div className="main-row">
                <div className="title" onClick={handleTitleClick}>
                    <img src="assets/icons/resume-logo.svg" draggable="false" />
                    <h3>ResumePro</h3>
                </div>

                <div className="directory">
                    <button className="user-btn" onClick={handleProfileClick}>
                        <img src="assets/icons/user.svg" draggable="false" />
                        <span>Vraj</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Nav;