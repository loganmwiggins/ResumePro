import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import AuthorizeView from '../components/AuthorizeView';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../utils/BaseUrl';
import { showToast } from '../utils/Toast';
import { allGreetings, messages } from '../utils/Messages';
import { resumeSortOptions } from '../utils/SelectOptions';
import '../stylesheets/Home.css';

function Home() {
    const navigate = useNavigate();
    const { user, userLoading } = useUser();
    const [resumes, setResumes] = useState([]);
    const [resumesLoading, setResumesLoading] = useState(true);
    const [sortedResumes, setSortedResumes] = useState([]);
    const [sortOption, setSortOption] = useState(() => sessionStorage.getItem("sortOption") || "updated-desc");
    const [homeGreeting, setHomeGreeting] = useState(""); // Ensures greeting doesn't change on re-render
    const [homeMessage, setHomeMessage] = useState(""); // Ensures message doesn't change on re-render
    const [openMenuId, setOpenMenuId] = useState(null);
    const [quickRename, setQuickRename] = useState(null)

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
                const response = await fetch(`${API_BASE_URL}/api/Resume/GetResumes/${user.id}`);

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

    // Handle opening and closing resume button actions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".resume-btns")) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);


    // Update sorted resumes when resumes or sortOption is changed
    useEffect(() => {
        if (resumesLoading) return;

        const sorted = [...resumes].sort((a, b) => {
            switch (sortOption) {
                case "updated-asc":
                    return new Date(a.updatedDateTime) - new Date(b.updatedDateTime);
                case "updated-desc":
                    return new Date(b.updatedDateTime) - new Date(a.updatedDateTime);
                case "title-asc":
                    return a.resumeName.localeCompare(b.resumeName);
                case "title-desc":
                    return b.resumeName.localeCompare(a.resumeName);
                default:
                    return 0;
            }
        });
    
        setSortedResumes(sorted);
    }, [resumes, sortOption, resumesLoading]);
    

    // First login - navigate to help and set boolean to false
    const handleFirstLogin = () => {
        navigate("/help");

        // Call API to update isFirstLogin to false
        fetch(`${API_BASE_URL}/api/User/UpdateFirstLogin/${user.id}`, {
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

    // Handle sorting resumes
    const handleSortChange = (selectedOption) => {
        if (!selectedOption) return; // Handle edge case if select is cleared somehow
        setSortOption(selectedOption.value);
        sessionStorage.setItem("sortOption", selectedOption.value);
    }

    // Resume 'more' menu functions
    const toggleMenu = (resumeId, event) => {
        event.stopPropagation();
        setOpenMenuId(openMenuId === resumeId ? null : resumeId);
    }

    // Preview resume
    const handlePreviewResume = (resumeId) => navigate(`/preview/${resumeId}`);

    // Duplicate resume
    const handleDuplicateResume = async (resumeId, event) => {
        event.stopPropagation();
        try {
            const response = await fetch(`${API_BASE_URL}/api/Resume/Duplicate`, {
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
            const updatedResumesResponse = await fetch(`${API_BASE_URL}/api/Resume/GetResumes/${user.id}`);
            const updatedResumes = await updatedResumesResponse.json();
    
            setResumes(updatedResumes);
    
        } catch (error) {
            showToast("Failed to duplicate resume.", "error");
            console.error("Failed to duplicate resume.", error.message);
        }
    };

    const handleRenameResume = async (resumeId, currentName, event, newName = null) => {
        event.stopPropagation();
        if (quickRename?.resumeId === resumeId && quickRename.newName != null ) {
            newName = quickRename.newName;
            // If already in rename mode and Enter is pressed, confirm rename
            if (!newName.trim()) {
                setQuickRename(currentName); // Exit rename mode if empty
                return;
            }
                const updatedTime = new Date();
            try {
                await fetch(`${API_BASE_URL}/api/Resume/Rename`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resumeId,newName, newTime: updatedTime}),
                });
    
                setResumes((prevResumes) =>
                    prevResumes.map((resume) =>
                        resume.resumeId === resumeId ? { ...resume, resumeName: quickRename.newName, updatedDateTime: updatedTime } : resume
                    )
                    
                );
            } catch (error) {
                console.error("Error renaming resume:", error);
            } finally {
                setQuickRename(null); // Exit rename mode
            }
        } 
        else {
            setQuickRename({ resumeId, newName: currentName }); // Enter rename mode
        }
    };

    // Resume insights
    const handleInsights = (resumeId, event) => { 
        event.stopPropagation();
        navigate(`/insights/${resumeId}`);
    }

    // Edit resume
    const handleEditResume = (templateId, resumeId, event) => {
        event.stopPropagation();
        navigate(`/builder/${templateId}/${resumeId}`);
    }

    // Delete resume
    const confirmDelete = (resumeId, event) => {
        event.stopPropagation();

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-alert">
                        <div className="alert-header">
                            <h3>Are you sure you want to delete this resume?</h3>
                            <p>This action cannot be undone. Your resume and all associated details will be permanently deleted.</p>
                        </div>
                        
                        <div className="alert-btns">
                            <button 
                                className="btn btn-outline"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-blue"
                                onClick={() => {
                                    handleDeleteResume(resumeId);
                                    onClose();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            }
        });
    }

    const handleDeleteResume = async (resumeId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Resume/DeleteResume/${resumeId}`,
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
                        <div className="my-resumes-head">
                            <h2>My Resumes</h2>
                            <Select 
                                options={resumeSortOptions}
                                onChange={(selectedOption) => handleSortChange(selectedOption ? selectedOption : "updated-desc")}
                                value={resumeSortOptions.find(option => option.value === sortOption)}
                                className="filter-select"
                            />
                        </div>
                        <div className="resumes-row">
                            {resumesLoading ? (
                                <div className="loading-spinner"></div>
                            ) : Array.isArray(resumes) && resumes.length > 0 ? (
                                // Resumes list
                                sortedResumes.map((resume, index) => (
                                    <div 
                                        key={resume.resumeId} 
                                        className="resume" 
                                        style={{ animationDelay: `${index * 0.2}s` }}
                                        onClick={() => handlePreviewResume(resume.resumeId)}
                                    >
                                        <div className="resume-img">
                                            {resume.thumbnail ? (
                                                <img src={resume.thumbnail} draggable="false" />
                                            ) : (
                                                <p>No Preview Available</p>
                                            )}
                                        </div>
    
                                        {quickRename?.resumeId === resume.resumeId ? (
                                            // Renaming ...
                                            <div className="rename-input-ctnr" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    value={quickRename.newName}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setQuickRename({ ...quickRename, newName: e.target.value })
                                                    }}
                                                    className="rename-input"
                                                    autoFocus
                                                />
                                                <div className="rename-btns">
                                                    <button
                                                        className="btn btn-icon"
                                                        title="Cancel rename"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setQuickRename(null);
                                                        }}
                                                    >
                                                        <img src="assets/icons/circle-xmark.svg" className="icon-dynamic rename-icons" draggable="false" />
                                                    </button>
                                                    <button
                                                        className="btn btn-icon"
                                                        title="Confirm rename"
                                                        onClick={(event) =>
                                                            handleRenameResume(resume.resumeId, resume.resumeName, event)
                                                        }
                                                    >
                                                        <img src="assets/icons/check-circle.svg" className="icon-dynamic rename-icons" draggable="false" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Normal (not renaming) ...
                                            <div className="resume-info">
                                                <div className="resume-txt">
                                                    <p>{resume.resumeName}</p>
                                                    <p>Last Updated: {new Date(resume.updatedDateTime).toLocaleDateString()}</p>
                                                </div>
                                                <div className="resume-btns">
                                                    {/* Ellipsis button */}
                                                    <button onClick={(event) => toggleMenu(resume.resumeId, event)}>
                                                        <img src="assets/icons/ellipsis.svg" className="icon-dynamic" draggable="false" />
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
                                                                    title="Rename Resume"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        handleRenameResume(resume.resumeId, resume.resumeName, event)}}
                                                                >
                                                                    <img src="assets/icons/text-box-edit.svg" className="icon-dynamic" draggable="false" />
                                                                </button>
                                                                <button 
                                                                    title="Duplicate Resume"
                                                                    onClick={(event) =>
                                                                        handleDuplicateResume(resume.resumeId, event)
                                                                    }
                                                                >
                                                                    <img src="assets/icons/duplicate.svg" className="icon-dynamic" draggable="false" />
                                                                </button>
                                                                <button 
                                                                    title="AI Insights"
                                                                    onClick={(event) =>
                                                                        handleInsights(resume.resumeId, event)
                                                                    }
                                                                >
                                                                    <img src="assets/icons/sparkles.svg" className="icon-dynamic" draggable="false" />
                                                                </button>
                                                                <button 
                                                                    title="Edit Resume"
                                                                    onClick={(event) =>
                                                                        handleEditResume(resume.templateId, resume.resumeId, event)
                                                                    }
                                                                >
                                                                    <img src="assets/icons/pencil.svg" className="icon-dynamic" draggable="false" />
                                                                </button>
                                                                <button 
                                                                    title="Delete Resume"
                                                                    onClick={(event) =>
                                                                        confirmDelete(resume.resumeId, event)
                                                                    }
                                                                >
                                                                    <img src="assets/icons/trash.svg" className="icon-dynamic" draggable="false" />
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div
                                    className="no-resume"
                                    title="No resumes yet. Click to create one!"
                                    onClick={handleNewResume}
                                >
                                    <img src="assets/icons/plus.svg" className="icon-dynamic" draggable="false" />
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