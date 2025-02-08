import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthorizeView from '../components/AuthorizeView';
import { useUser } from '../context/UserContext';
import { showToast } from '../utils/Toast';
import '../stylesheets/Home.css';

function Home() {
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [resumes, setResumes] = useState([]);

    // Array of possible greetings
    const greetings = [
        "Hi", "Hey", "Hello", "Welcome", "Greetings", "What's up", "Howdy",
        "Good to see you", "Hey there", "Hello there"
    ];

    // Array of possible messages
    const messages = [
        "Create your own custom resume to apply for jobs.",
        "Ready to make a resume?",
        "Your dream job starts with a great resume!",
        "Showcase your skills with a professional resume.",
        "Time to build a resume that stands out!",
        "Make a resume that gets you hired.",
        "Polish your resume and land that job!",
        "Craft a resume that highlights your strengths.",
        "Your next job is just a great resume away!",
        "Let’s make your resume shine.",
        "Stand out in the job market with a stellar resume.",
        "Turn your skills into an opportunity with a great resume.",
        "Get one step closer to your dream job.",
        "Put your best foot forward with a top-notch resume.",
        "Your career journey starts with a strong resume.",
        "A resume that speaks for you – let's build it!",
        "Let’s get that resume looking sharp!",
        "Ready to impress recruiters? Let's start!",
        "Make your resume as amazing as you are."
    ];

    // Function to randomly pick a greeting and a message
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

    // GET ALL RESUMES
    useEffect(() => {
        if (!user || !user.id) return;

        const fetchResumes = async () => {
            try {
                const response = await fetch(`https://localhost:7035/api/Resume/GetResumes/${user.id}`);

                if (!response.ok) {
                    showToast("Error fetching resumes.", "error");
                    throw new Error('Failed to fetch resumes');
                }

                const data = await response.json();

                if (!data || data.length === 0) {
                    console.log("No resumes for this user.");
                    showToast("Create your first resume.", "info", "Let's get started!");
                    setResumes([]);
                    return;
                }

                setResumes(data); // Assuming API returns an array of resumes
            }
            catch (error) {
                console.error('(catch) Error fetching resumes:', error);
                showToast("An error occurred.", "error");
                setResumes([]);
            }
        };

        fetchResumes();
    }, [user]);

    // Handle navigation to create a new resume
    const handleNewResume = () => navigate('/templates');

    // Handle navigation to resume insights
    const handleInsights = (resumeId) => navigate(`/insights/${resumeId}`);

    // Handle editing a resume
    const handleEditResume = (resumeId) => navigate(`/edit-resume/${resumeId}`);

    // Handle deleting a resume
    const handleDeleteResume = async (resumeId) => {
        if (!window.confirm('Are you sure you want to delete this resume?')) return;

        console.log(resumeId);

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
            {loading ? (
                <div className="loading-spinner"></div>
            ) : (
                <div className="page-ctnr">
                    {/* Home header */}
                    <div className="home-header">
                        <div className="page-header">
                            <h1>{getRandomElement(greetings)}, {user.firstName}</h1>
                            <p>{getRandomElement(messages)}</p>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleNewResume}
                            >
                                <img src="assets/icons/plus.svg" draggable="false" />
                                <span>New Resume</span>
                            </button>
                        </div>
                    </div>

                    {/* My Resumes section */}
                    <div className="my-resumes-ctnr">
                        <h2>My Resumes</h2>
                        <div className="resumes-row">
                            {Array.isArray(resumes) && resumes.length > 0 ? (
                                resumes.map((resume) => (
                                    <div className="resume" key={resume.resumeId}>
                                        <div className="resume-img"></div>
                                        <div className="resume-info">
                                            <div className="resume-txt">
                                                <p>{resume.resumeName}</p>
                                                <p>Last Updated: {new Date(resume.updatedDateTime).toLocaleDateString()}</p>
                                            </div>
                                            <div className="resume-btns">
                                                <button onClick={() => handleInsights(resume.resumeId)}>
                                                    <img src="assets/icons/sparkles.svg" draggable="false" />
                                                </button>
                                                <button onClick={() => handleEditResume(resume.resumeId)}>
                                                    <img src="assets/icons/pencil.svg" draggable="false" />
                                                </button>
                                                <button onClick={() => handleDeleteResume(resume.resumeId)}>
                                                    <img src="assets/icons/trash.svg" draggable="false" />
                                                </button>
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