import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showToast } from "../utils/Toast";
import html2pdf from "html2pdf.js";

import AllTemplates from "../components/Templates/AllTemplates";
import "../stylesheets/ResumePreview.css";

const ResumePreview = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const resumeRef = useRef(null);
    const [resumeData, setResumeData] = useState(null);

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
                const response = await fetch(`https://localhost:7035/api/Resume/GetResumeById/${resumeId}`);

                if (!response.ok) {
                    showToast("Failed to fetch resume", "error");
                    throw new Error(`Failed to fetch resume. Status: ${response.status}`);
                }

                const data = await response.json();
                setResumeData(data);

            } 
            catch (error) {
                console.error("Error fetching resume:", error);
                showToast("Failed to fetch resume", "error");
            }
        };

        fetchResume();
    }, [resumeId]);

    // Button functions
    const handleHome = () => navigate("/home");

    const handleDownloadPDF = () => {
        const element = resumeRef.current;
        html2pdf()
            .set({
                filename: `${resumeData?.resumeName || "Resume"}.pdf`,
                image: { type: "jpeg", quality: 5 },
                html2canvas: { scale: 1 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .from(element)
            .save();
    };

    const handleInsights = () => navigate(`/insights/${resumeId}`);



    if (!resumeData) return <div className="loading-spinner"></div>;

    return (
        <div className="preview-ctnr">
            <div className="preview-header">
                <h1>{getRandomElement(successMessages)}</h1>
                <p>Your "{resumeData.resumeName}" resume has been created. What's next?</p>
            </div>

            <div className="preview-actions">
                <button onClick={handleHome} title="Go to home page">
                    <img src="/assets/icons/home.svg" draggable="false" />
                    <span>Home</span>
                </button>
                <button onClick={() => alert("lol not working yet")} title="Go back and edit your resume">
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
            </div>

            <div className="resume-view">
                <div ref={resumeRef}>
                    <AllTemplates selectedTemplate={resumeData.templateId} resumeData={resumeData} viewMode="preview" />
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;