import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { useUser } from "../context/UserContext"; 
import LogoutLink from "../components/LogoutLink";
import '../stylesheets/Nav.css';

function Nav() {
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleTitleClick = () => { navigate("/home"); };
    const handleProfileClick = () => { 
        navigate("/profile"); 
        setIsDropdownOpen(false);
    };
    const handleEditProfileClick = () => { navigate("/edit-profile"); };
    const handleLoginClick = () => { navigate("/login"); }
    const handleSignUpClick = () => { navigate("/signup"); }

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".profile-ctnr")) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
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
                        <div className="profile-ctnr">
                            {/* Profile Button */}
                            <button className="user-btn" onClick={toggleDropdown} title="Profile">
                                <img src="/assets/icons/user.svg" draggable="false" />
                                <img src="/assets/icons/angle-down.svg" draggable="false" />
                            </button>

                            {/* User dropdown menu */}
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        className="dropdown-menu"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        <button onClick={handleProfileClick}>My Profile</button>
                                        <button onClick={handleEditProfileClick}>Edit Profile</button>
                                        <LogoutLink>Logout</LogoutLink>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                    // If user is NOT logged in...
                        <div className="btn-ctnr">
                            <button onClick={handleSignUpClick} className="btn btn-outline">
                                <span>Sign Up</span>
                            </button>
                            <button onClick={handleLoginClick} className="btn btn-black">
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