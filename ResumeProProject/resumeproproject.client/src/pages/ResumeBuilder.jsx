import React, { useState } from 'react';
import '../stylesheets/ResumeBuilder.css';
import AuthorizeView from '../components/AuthorizeView';
import { useUser } from "../context/UserContext";
import { showToast } from '../utils/Toast';

function ResumeBuilder() {
    const { user, loading } = useUser();

    const [resumeData, setResumeData] = useState({
        Id: loading ? "000" : user.id,
        Name: "Untitled Document",
        UpdatedDateTime: new Date(),
        TemplateId: "000",
        GeneralInformation: { firstName: "", middleName: "", lastName: "", email: "", phoneNumber: "", websiteUrl: "", linkedinUrl: "", githubUrl: "" },
        Educations: [{ schoolName: "", degreeType: "", gpa: 0.0, major: "", minor: "", startDate: new Date(), endDate: new Date() }],
        Experiences: [{ companyName: "", role: "", startDate: new Date(), endDate: new Date(), isCurrent: false, description: "", location: "", officeType: "", jobType: "" }],
        Certifications: [{ name: "", issuer: "", issueDate: new Date(), expireDate: new Date() }],
        Projects: [{ title: "", description: "", startDate: new Date(), endDate: new Date() }],
        Skills: [{ skillsJson: "" }],
    });

    const handleChange = (section, field, value, index = null) => {
        setResumeData(prevData => {
            if (index !== null) {
                return {
                    ...prevData,
                    [section]: prevData[section].map((item, i) => i === index ? { ...item, [field]: value } : item)
                };
            } else {
                return {
                    ...prevData,
                    [section]: { ...prevData[section], [field]: value }
                };
            }
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("/api/Resume/Create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resumeData),
            });
            
            if (response.ok) {
                const data = await response.json();
                showToast("Resume created successfully!", "success");
            } else {
                showToast("Failed to create resume.", "error");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <AuthorizeView>
            <div className="builder-ctnr">
                <div className="template-view">x</div>
                <div className="build-view">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <section id="general-information">
                            <h3>General Information</h3>
                            <div className="inputs-ctnr">
                                {Object.keys(resumeData.GeneralInformation).map((key) => (
                                    <div className="input-field" key={key}>
                                        <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        <input 
                                            type="text" 
                                            name={key}
                                            placeholder={`Enter ${key}`}
                                            value={resumeData.GeneralInformation[key]}
                                            onChange={(e) => handleChange("GeneralInformation", key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                        
                        <section id="experience">
                            <h3>Experience</h3>
                            <div className="inputs-ctnr">
                                {resumeData.Experiences.map((experience, index) => (
                                    <div key={index} className="experience-entry">
                                        {Object.keys(experience).map((key) => (
                                            <div className="input-field" key={key}>
                                                <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                {key === "isCurrent" ? (
                                                    <input
                                                        type="checkbox"
                                                        name={key}
                                                        checked={experience[key]}
                                                        onChange={(e) => handleChange("Experiences", key, e.target.checked, index)}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        name={key}
                                                        placeholder={`Enter ${key}`}
                                                        value={experience[key]}
                                                        onChange={(e) => handleChange("Experiences", key, e.target.value, index)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </section>
                        <button type="submit">Save Resume</button>
                    </form>
                </div>
            </div>
        </AuthorizeView>
    );
}

export default ResumeBuilder;