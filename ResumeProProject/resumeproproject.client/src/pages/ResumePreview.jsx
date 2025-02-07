import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import AllTemplates from "../components/Templates/AllTemplates";
import "../stylesheets/ResumePreview.css";

const ResumePreview = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const resumeRef = useRef(null);
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await fetch(`https://localhost:7035/api/Resume/GetResumeById/${resumeId}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch resume. Status: ${response.status}`);
                }

                const data = await response.json();
                setResumeData(data);

            } catch (error) {
                console.error("Error fetching resume:", error);
                alert("Failed to fetch resume.");
            }
        };

        fetchResume();
    }, [resumeId]);

    const handleDownloadPDF = () => {
        const element = resumeRef.current;
        html2pdf()
            .set({
                filename: `${resumeData?.resumeName || "Resume"}.pdf`,
                image: { type: "jpeg", quality: 5 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .from(element)
            .save();
    };


    if (!resumeData) return <div>Loading...</div>;

    return (
        <div className="resume-preview-container">
            <h1>{resumeData.resumeName}</h1>

            <div className="resume-preview-view">
            <div ref={resumeRef}>
                <AllTemplates selectedTemplate={resumeData.templateId} resumeData={resumeData} />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="resume-preview-actions">
                <button onClick={() => alert("lol not working yet")}>Edit Resume</button>
                <button onClick={() => alert("lol not working yet")}>AI Insights</button>
                <button onClick={handleDownloadPDF}>Download PDF</button>
            </div>
        </div>
    );
};

export default ResumePreview;
