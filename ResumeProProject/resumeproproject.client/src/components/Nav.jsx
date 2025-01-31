import React from 'react';

import '../stylesheets/Nav.css';

function Nav() {
  return (
    <div className="nav-container">
        <div className="main-row">
            <div className="title">
                <img src="assets/icons/resume-logo.svg" draggable="false" />
                <h3>ResumePro</h3>
            </div>

            <div className="directory">
                <button className="user-btn">
                    <img src="assets/icons/user.svg" draggable="false" />
                </button>
            </div>
        </div>
    </div>
  )
}

export default Nav;