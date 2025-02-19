import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import AuthorizeView from '../components/AuthorizeView';
import { useUser } from '../context/UserContext';
import { showToast } from '../utils/Toast';
import { allGreetings, messages } from '../utils/Messages';
import '../stylesheets/Home.css';

function Home() {
    const navigate = useNavigate();
    const { user, userLoading } = useUser();
    const [resumes, setResumes] = useState([]);
    const [resumesLoading, setResumesLoading] = useState(true);
    const [homeGreeting, setHomeGreeting] = useState(""); // Ensures greeting doesn't change on re-render
    const [homeMessage, setHomeMessage] = useState(""); // Ensures message doesn't change on re-render
    const [openMenuId, setOpenMenuId] = useState(null);

    // Function to randomly pick a greeting and a message
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

    // GET ALL RESUMES
    useEffect(() => {
        if (!user || !user.id) return;

        // Handle first login help walkthrough
        if (user.isFirstLogin) {
            handleFirstLogin();
            return;
        }

        const fetchResumes = async () => {
            setResumesLoading(true); // Start loading

            try {
                const response = await fetch(`https://localhost:7035/api/Resume/GetResumes/${user.id}`);

                if (!response.ok) {
                    showToast("Error fetching resumes.", "error");
                    throw new Error('Failed to fetch resumes');
                }

                const data = await response.json();

                if (!data || data.length === 0) {
                    setResumes([]);
                    return;
                }
                else { setResumes(data); }
            }
            catch (error) {
                console.error('(catch) Error fetching resumes:', error);
                showToast("An error occurred.", "error");
                setResumes([]);
            }
            finally {
                setResumesLoading(false);   // Stop loading
            }
        };

        fetchResumes();
        setHomeGreeting(getRandomElement(allGreetings)); // Set greeting once on mount
        setHomeMessage(getRandomElement(messages)); // Set message once on mount
    }, [user]);


    const handleFirstLogin = () => {
        navigate("/help");

        // Call API to update isFirstLogin to false
        fetch(`https://localhost:7035/api/User/UpdateFirstLogin/${user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to update first login");
                return response.json();
            })
            .then(() => {
                // Update user data so state reflects the change
                user.isFirstLogin = false;
            })
            .catch(error => console.error("Error updating first login:", error));
    }

    // Handle navigation to create a new resume
    const handleNewResume = () => navigate('/templates');

    // Resume 'more' menu functions
    const toggleMenu = (resumeId, event) => {
        event.stopPropagation();
        setOpenMenuId(openMenuId === resumeId ? null : resumeId);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".resume-btns")) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);


    // Resume button functions
    const handlePreviewResume = (resumeId) => navigate(`/preview/${resumeId}`);

    const handleDuplicateResume = async (resumeId, event) => {
        event.stopPropagation();
        try {
            const response = await fetch('https://localhost:7035/api/Resume/Duplicate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId, CurrentDate: new Date() }),
            });
    
            if (!response.ok) {
                showToast("Failed to duplicate resume", "error");
                throw new Error("Failed to duplicate resume.");
            }
    
            showToast("Resume duplicated successfully", "success");
    
            // Re-fetch all resumes to ensure the UI updates correctly
            const updatedResumesResponse = await fetch(`https://localhost:7035/api/Resume/GetResumes/${user.id}`);
            const updatedResumes = await updatedResumesResponse.json();
    
            setResumes(updatedResumes);
    
        } catch (error) {
            showToast("Failed to duplicate resume.", "error");
            console.error("Failed to duplicate resume.", error.message);
        }
    };
    
    

    const handleInsights = (resumeId, event) => { 
        event.stopPropagation();
        navigate(`/insights/${resumeId}`);
    }

    const handleEditResume = (templateId, resumeId, event) => {
        event.stopPropagation();
        navigate(`/builder/${templateId}/${resumeId}`);
    }

    const handleDeleteResume = async (resumeId, event) => {
        event.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this resume?')) return;

        try {
            const response = await fetch(`https://localhost:7035/api/Resume/DeleteResume/${resumeId}`,
            {
                method: 'DELETE',
            });

            if (!response.ok) {
                showToast("Error deleting resume.", "error");
                throw new Error("Failed to delete resume.");
            }

            showToast("Resume deleted successfully", "success");
            setResumes((prevResumes) => prevResumes.filter((r) => r.resumeId !== resumeId));
        }
        catch (error) {
            console.error("Error deleting resume:", error);
        }
    };



    return (
        <AuthorizeView>
            {userLoading ? (
                <div className="loading-spinner"></div>
            ) : (
                <div className="page-ctnr">
                    {/* Home header */}
                    <div className="home-header">
                        <div className="page-header">
                            {user?.firstName && (
                                <h1>{homeGreeting}, {user.firstName}</h1>
                            )}
                            <p>{homeMessage}</p>
                        </div>
                        <div>
                            <button type="button" onClick={handleNewResume}>
                                <img src="assets/icons/plus.svg" draggable="false" />
                                <span>New Resume</span>
                            </button>
                        </div>
                    </div>

                    {/* My Resumes section */}
                    <div className="my-resumes-ctnr">
                        <h2>My Resumes</h2>
                        <div className="resumes-row">
                            {resumesLoading ? (
                                <div className="loading-spinner"></div>
                            ) : Array.isArray(resumes) && resumes.length > 0 ? (
                                resumes.map((resume, index) => (
                                    <div 
                                        key={resume.resumeId} 
                                        className="resume" 
                                        style={{ animationDelay: `${index * 0.2}s`}}
                                        onClick={() => handlePreviewResume(resume.resumeId)}
                                    >
                                        <div className="resume-img">
                                            {resume.thumbnail ? (
                                                <img src={resume.thumbnail} draggable="false" />
                                            ) : (
                                                <p>No Preview Available</p>
                                            )}
                                        </div>
                                        <div className="resume-info">
                                            <div className="resume-txt">
                                                <p>{resume.resumeName}</p>
                                                <p>Last Updated: {new Date(resume.updatedDateTime).toLocaleDateString()}</p>
                                            </div>
                                            <div className="resume-btns">
                                                {/* Ellipsis button */}
                                                <button onClick={(event) => toggleMenu(resume.resumeId, event)}>
                                                    <img src="assets/icons/ellipsis.svg" draggable="false" />
                                                </button>

                                                {/* Animated dropdown menu */}
                                                <AnimatePresence>
                                                    {openMenuId === resume.resumeId && (
                                                        <motion.div
                                                            className="btns-menu"
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                                        >
                                                            <button 
                                                                title="AI Insights"
                                                                onClick={(event) => handleInsights(resume.resumeId, event)}
                                                            >
                                                                <img src="assets/icons/sparkles.svg" draggable="false" />
                                                            </button>
                                                            <button 
                                                                title="Duplicate Resume"
                                                                onClick={(event) => handleDuplicateResume(resume.resumeId, event)}
                                                            >
                                                                <img src="assets/icons/duplicate.svg" draggable="false" />
                                                            </button>
                                                            <button 
                                                                title="Edit Resume"
                                                                onClick={(event) => handleEditResume(resume.templateId, resume.resumeId, event)}
                                                            >
                                                                <img src="assets/icons/pencil.svg" draggable="false" />
                                                            </button>
                                                            <button 
                                                                title="Delete Resume"
                                                                onClick={(event) => handleDeleteResume(resume.resumeId, event)}
                                                            >
                                                                <img src="assets/icons/trash.svg" draggable="false" />
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div
                                    className="no-resume"
                                    title="No resumes yet. Click to create one!"
                                    onClick={handleNewResume}
                                >
                                    <img src="assets/icons/plus.svg" draggable="false" />
                                    <p>Create a Resume</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthorizeView>
    );
}

export default Home;