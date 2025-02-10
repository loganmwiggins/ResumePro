import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/UserContext"; 
import LogoutLink from "../components/LogoutLink";
import '../stylesheets/Nav.css';

function Nav() {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleTitleClick = () => { navigate("/home"); };
    const handleProfileClick = () => { navigate("/profile"); };
    const handleLoginClick = () => { navigate("/login"); }
    const handleSignUpClick = () => { navigate("/signup"); }

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="nav-container">
            <div className="main-row">
                <div className="title" onClick={handleTitleClick} title="Go Home">
                    <img src="/assets/icons/resume-logo.svg" draggable="false" />
                    <h3>ResumePro</h3>
                </div>

                <div className="directory">
                    {loading ? (
                        <div className="loading-spinner"></div>
                    ) : user ? (
                    // If user is logged in...
                        <div className="profile-container" ref={dropdownRef}>
                            {/* Profile Button */}
                            <button className="user-btn" onClick={toggleDropdown} title="Profile">
                                <img src="/assets/icons/user.svg" draggable="false" />
                                {/*<span>{user.firstName}</span> */}
                                <img src="/assets/icons/angle-down.svg" draggable="false" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <button onClick={handleProfileClick}>View Profile</button>
                                <LogoutLink>Logout</LogoutLink>
                            </div>
                        </div>
                    ) : (
                    // If user is NOT logged in...
                        <div className="btn-ctnr">
                            <button onClick={handleSignUpClick}>
                                <span>Sign Up</span>
                            </button>
                            <button onClick={handleLoginClick}>
                                <span>Login</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Nav;