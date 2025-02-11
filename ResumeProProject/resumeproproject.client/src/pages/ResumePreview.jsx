import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showToast } from "../utils/Toast";
import html2pdf from "html2pdf.js";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
//import { PDFDocument } from "pdf-lib";
//import mammoth from "mammoth";
import { saveAs } from "file-saver";
import AllTemplates from "../components/Templates/AllTemplates";
import "../stylesheets/ResumePreview.css";
//import pdfOfficegen from "pdf-officegen";
//import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

const ResumePreview = () => {
    //pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    //    "pdfjs-dist/build/pdf.worker.min.js",
    //    import.meta.url
    //).href;
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
                const response = await fetch(`https://localhost:7035/api/Resume/GetResumeById/${resumeId}`);

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

                // Confetti !
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
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
    const handleHome = () => navigate("/home");

    const handleDownloadPDF = () => {
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
            .then(() => {
                console.log("PDF Download Complete");
            });
    };

    const handleInsights = () => navigate(`/insights/${resumeId}`);

    const handleDownloadHTML = () => {
        if (!resumeRef.current) return;

        const htmlContent = resumeRef.current.innerHTML;
        const blob = new Blob([htmlContent], { type: "text/html" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${resumeData?.resumeName || "Resume"}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShareToLinkedIn = () => {
        try {
            const postMessage = "Check out the resume I just created with ResumePro! #Career #ResumeBuilder";

            const attachmentUrl = resumeData.PdfUrl ? resumeData.PdfUrl : resumeData.Thumbnail;

            navigator.clipboard.writeText(postMessage);
            showToast("Message copied! Paste it when you create your post.", "info");

            handleDownloadPDF();
            //setTimeout(0,10000)

            const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(attachmentUrl)}`;

            window.open(linkedInShareUrl, "_blank");

        } catch (error) {
            console.error("Error sharing to LinkedIn:", error);
            showToast("Failed to share on LinkedIn.", "error");
        }
    };


    const handleDownloadWord = () => {
        if (!resumeRef.current) return;

        const contentElement = resumeRef.current.cloneNode(true);

        const imgElements = contentElement.querySelectorAll("img");
        imgElements.forEach((img) => {
            if (img.src.startsWith("data:image")) {
                img.style.maxWidth = "10px";
                img.style.maxHeight = "10px";
            } else {
                img.src = img.src; 
                img.style.maxWidth = "10px";
                img.style.maxHeight = "10px";
            }
        });

        const header = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <meta charset="UTF-8">
        <title>Resume Document</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 12pt;
                line-height: 1.5;
                color: #333;
            }
            h1, h2, h3 { font-weight: bold; }
            p { margin-bottom: 10px; }
            img { display: block; margin: 10px 0; max-width: 10px; max-height: 10px; }
        </style>
    </head>
    <body>
`;

        const footer = "</body></html>";

        const sourceHTML = header + contentElement.innerHTML + footer;

        const blob = new Blob([sourceHTML], { type: "application/msword" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${resumeData?.resumeName || "Resume"}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadImage = async () => {
        if (!resumeRef.current) return;

        const canvas = await html2canvas(resumeRef.current, {
            backgroundColor: "#FFFFFF", 
            scale: 3,
        });

        const imgData = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${resumeData?.resumeName || "Resume"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!resumeData) return <div className="loading-spinner"></div>;

    return (
        <div className="preview-ctnr">
            <div className="preview-header">
                <h1>{successMessage}</h1>
                <p>Your "{resumeData.resumeName}" resume has been created. What's next?</p>
            </div>

            {showConfetti ?
                <Fireworks autorun={{ speed: 1, duration: 2000 }} />
                : ''
            }

            <div className="preview-actions">
                <button onClick={handleHome} title="Go to home page">
                    <img src="/assets/icons/home.svg" draggable="false" />
                    <span>Home</span>
                </button>
                <button onClick={() => setShowConfetti(!showConfetti)} title="Go back and edit your resume">
                    <img src="/assets/icons/pencil.svg" draggable="false" />
                    <span>Edit Resume</span>
                </button>
                <button onClick={handleDownloadPDF} title="Save your resume to your device">
                    <img src="/assets/icons/document.svg" draggable="false" />
                    <span>Download PDF</span>
                </button>
                <button onClick={handleDownloadHTML} title="Save your resume to your device">
                    <img src="/assets/icons/document.svg" draggable="false" />
                    <span>Download DOCX</span>
                </button>
                <button onClick={handleDownloadImage} title="Save your resume to your device">
                    <img src="/assets/icons/document.svg" draggable="false" />
                    <span>Download PNG</span>
                </button>
                <button onClick={handleShareToLinkedIn} title="Share resume to LinkedIn">
                    <img src="/assets/icons/linkedin.svg" draggable="false" />
                    <span>Share to LinkedIn</span>
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