import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';

import { API_BASE_URL } from '../utils/BaseUrl';
import { showToast } from '../utils/Toast';
import AllTemplates from '../components/templates/AllTemplates';
import '../stylesheets/ResumePreview.css';

const ResumePreview = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const resumeRef = useRef(null);
    const [resumeData, setResumeData] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [successMessage, setSuccessMessage] = useState(""); // Ensures message doesn't change on re-render

    const successMessages = [
        "Congratulations!", "Nice!", "Awesome!", "Amazing!", "Good Job!", "Nice Job!",
        "Nice Work!", "Good Work!", "Yay!", "Sweet!", "Great Job!", "Done!"
    ];

    // Function to randomly pick a greeting and a message
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

    // Get resume function
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/Resume/GetResumeById/${resumeId}`);

                if (!response.ok) {
                    showToast("Failed to fetch resume", "error");
                    throw new Error(`Failed to fetch resume. Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.skills?.skillsDataJson) {
                    try {
                        data.skills.skillsDataJson = JSON.parse(data.skills.skillsDataJson);
                    } catch (error) {
                        console.error("Error parsing skillsDataJson:", error);
                        data.skills.skillsDataJson = {};
                    }
                }

                setResumeData(data);

                // Confetti ! (delayed by 0.6s)
                setTimeout(() => {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000); // Stop after 3s
                }, 600);
            }
            catch (error) {
                console.error("Error fetching resume:", error);
                showToast("Failed to fetch resume", "error");
            }
        };

        fetchResume();
        setSuccessMessage(getRandomElement(successMessages)); // Set message once on mount
    }, [resumeId]);

    // Button functions
    const handleEditResume = (templateId, resumeId) => {
        navigate(`/builder/${templateId}/${resumeId}`);
    }

    const handleDownloadPDF = async () => {
        const html2pdf = (await import("html2pdf.js")).default;
        const element = resumeRef.current;

        element.style.width = "100%";
        element.style.maxWidth = "800px";
        element.style.height = "auto";
        element.style.transform = "scale(1)";

        html2pdf()
            .set({
                filename: `${resumeData?.resumeName || "Resume"}.pdf`,
                image: { type: "jpeg", quality: 5 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .from(element)
            .save()
            .then(() => { console.log("PDF Download Complete"); });
    };

    const handleInsights = () => navigate(`/insights/${resumeId}`);

    const handleShare = () => navigate(`/share/${resumeId}`);


    if (!resumeData) return <div className="loading-spinner"></div>;

    return (
        <div className="preview-ctnr">
            {showConfetti ?
                <Fireworks autorun={{ speed: 1, duration: 2000 }} />
                : ''
            }

            <motion.div 
                className="preview-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
            >
                <h1>{successMessage}</h1>
                <p>Your "{resumeData.resumeName}" resume has been saved. What's next?</p>
            </motion.div>

            <motion.div 
                className="preview-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <button onClick={() => handleEditResume(resumeData.templateId, resumeId)} title="Go back and edit your resume">
                    <img src="/assets/icons/pencil.svg" draggable="false" />
                    <span>Edit Resume</span>
                </button>
                <button onClick={handleDownloadPDF} title="Save your resume to your device">
                    <img src="/assets/icons/document.svg" draggable="false" />
                    <span>Download PDF</span>
                </button>
                <button onClick={handleInsights} title="Get AI recommendations to improve your resume">
                    <img src="/assets/icons/sparkles.svg" draggable="false" />
                    <span>AI Insights</span>
                </button>
                <button onClick={handleShare} title="Share your resume with others">
                    <img src="/assets/icons/paper-plane.svg" draggable="false" />
                    <span>Share</span>
                </button>
            </motion.div>

            <motion.div 
                className="resume-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                <div ref={resumeRef}>
                    <AllTemplates 
                        selectedTemplate={resumeData.templateId} 
                        resumeData={resumeData} 
                        color={JSON.parse(resumeData.colorJson)} 
                        textSize={resumeData.textSize} 
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default ResumePreview;