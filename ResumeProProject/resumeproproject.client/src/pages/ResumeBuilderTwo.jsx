import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/ResumeBuilder.css';
import AuthorizeView from '../components/AuthorizeView';
import { useUser } from "../context/UserContext";
import { showToast } from '../utils/Toast';

function ResumeBuilderTwo() {
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [resumeData, setResumeData] = useState(null);

    const [visibleSections, setVisibleSections] = useState("generalInformation");

    // When user data is available, set resumeData
    useEffect(() => {
        if (user?.id) {
            setResumeData({
                id: user.id,
                resumeName: "Untitled Document",
                currentDate: new Date(),
                templateId: "4b5aac66-6e72-4ffe-a6fc-ca6c76c31270",
                generalInformation: {
                    firstName: null,
                    middleName: null,
                    lastName: null,
                    email: null,
                    phoneNumber: null,
                    websiteUrl: null,
                    linkedInUrl: null,
                    gitHubUrl: null
                },
                skills: {
                    skillsDataJson: "[]"
                },
                experiences: [],
                educations: [],
                certifications: [],
                projects: []
            });
        }
    }, [user]); // Runs whenever 'user' changes

    const handleChange = (section, field, value, index = null) => {
        setResumeData((prevResume) => {
            if (index !== null) {
              return {
                ...prevResume,
                [section]: prevResume[section].map((entry, i) =>
                  i === index ? { ...entry, [field]: value } : entry
                ),
              };
            }
            return {
              ...prevResume,
              [section]: {
                ...prevResume[section],
                [field]: value,
              },
            };
        });
    };

    const handleAddEntry = (section, entry) => {
        setResumeData((prevResume) => ({
          ...prevResume,
          [section]: [...prevResume[section], entry],
        }));
      };
    
    const handleShowSection = (section) => {
        if (!visibleSections.includes(section)) {
            setVisibleSections([...visibleSections, section]);
        }
    };

    const handleCancel = () => {
        showToast("Resume abandoned.", "info");
        navigate("/home");
    }

    // [POST] to Create Resume from form
    const handleSubmit = async () => {
        console.log("Sending Data: ", JSON.stringify(resumeData, null, 2));

        try {
            const response = await fetch("https://localhost:7035/api/Resume/Create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resumeData),
            });
            
            if (response.ok) {
                const data = await response.json();
                showToast("Resume created successfully!", "success");
            } 
            else {
                showToast("Failed to create resume.", "error");
            }
        } 
        catch (error) {
            console.error("Error:", error);
            showToast("An error occurred.", "error");
        }
    };

    if (loading || !resumeData) {
        return <div className="loading-spinner"></div>;
    }
    else {
        return (
            <AuthorizeView>
                <form className="builder-ctnr" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    {/* LEFT SIDE */}
                    <div className="template-view">
                        <div className="resume-ctnr"></div>
                        <div className="resume-actions">
                            <input type="text" name="resumeName" placeholder="Name of Document" value={resumeData.resumeName} onChange={handleChange} />
                            <button type="button" onClick={handleCancel}>Cancel</button>
                            <button type="submit">Save Resume</button>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="build-view">
                        {/* GENERAL INFORMATION */}
                        <section id="general-information">
                            <h3>General Information</h3>
                            <div className="inputs-ctnr">
                                <div className="input-field">
                                    <label>First Name <span className="req">*</span></label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange("generalInformation", "firstName", e.target.value)}
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Middle Name</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange("generalInformation", "middleName", e.target.value)}
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Last Name <span className="req">*</span></label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange("generalInformation", "lastName", e.target.value)} 
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        onChange={(e) => handleChange("generalInformation", "email", e.target.value)}
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        onChange={(e) => handleChange("generalInformation", "phoneNumber", e.target.value)}
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Website URL</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange("generalInformation", "websiteUrl", e.target.value)}
                                    />
                                </div>
                                <div className="input-field">
                                    <label>LinkedIn URL</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange("generalInformation", "linkedInUrl", e.target.value)}
                                    />
                                </div>
                                <div className="input-field">
                                    <label>GitHub URL</label>
                                    <input
                                        type="text"
                                        onChange={(e) => handleChange("generalInformation", "gitHubUrl", e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        
                        {/* EXPERIENCES */}
                        {visibleSections.includes("experiences") && (
                            <section>
                                <h3>Experience</h3>

                                {/* Individual experience entry */}
                                {resumeData.experiences.map((exp, index) => (
                                    <div className="inputs-ctnr" key={index}>
                                        <h4>#{index + 1} - {resumeData.experiences[index].companyName}</h4>
                                        <div className="input-field">
                                            <label>Company / Employer <span className="req">*</span></label>
                                            <input
                                                type="text"
                                                onChange={(e) => handleChange("experiences", "companyName", e.target.value, index)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Role <span className="req">*</span></label>
                                            <input
                                                type="text"
                                                onChange={(e) => handleChange("experiences", "role", e.target.value, index)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Start Date <span className="req">*</span></label>
                                            <input 
                                                type="date" 
                                                onChange={(e) => handleChange("experiences", "startDate", e.target.value, index)} 
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>End Date</label>
                                            <input 
                                                type="date" 
                                                onChange={(e) => handleChange("experiences", "endDate", e.target.value, index)} 
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Description <span className="req">*</span></label>
                                            <input 
                                                type="textarea" 
                                                onChange={(e) => handleChange("experiences", "description", e.target.value, index)} 
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Location</label>
                                            <input 
                                                type="text" 
                                                onChange={(e) => handleChange("experiences", "location", e.target.value, index)} 
                                            />
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Add Another Experience button */}
                                <button type="button" onClick={() => handleAddEntry("experiences", {
                                    companyName: "",
                                    role: "",
                                    startDate: new Date(),
                                    endDate: null,
                                    isCurrent: null,
                                    description: "",
                                    location: null,
                                    officeType: 0,
                                    jobType: 0
                                })}>Add Experience</button>
                            </section>
                        )}


                        {/* EDUCATIONS */}
                        {visibleSections.includes("educations") && (
                            <section>
                                <h3>Education</h3>

                                {/* Education entry */}
                                {resumeData.educations.map((edu, index) => (
                                    <div className="inputs-ctnr" key={index}>
                                        <h4>#{index+1}</h4>
                                        <div className="input-field">
                                            <label>School / University <span className="req">*</span></label>
                                            <input 
                                                type="text"
                                                onChange={(e) => handleChange("educations", "schoolName", e.target.value, index)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Degree Type <span className="req">*</span></label>
                                            <select onChange={(e) => handleChange("educations", "degreeType", e.target.value, index)}>
                                                <option value={0}>Undergraduate</option>
                                                <option value={1}>Graduate</option>
                                                <option value={2}>Doctorate</option>
                                            </select>
                                        </div>
                                        <div className="input-field">
                                            <label>GPA</label>
                                            <input 
                                                type="number"
                                                onChange={(e) => handleChange("educations", "gpa", e.target.value, index)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Major <span className="req">*</span></label>
                                            <input 
                                                type="text"
                                                onChange={(e) => handleChange("educations", "major", e.target.value, index)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Minor</label>
                                            <input 
                                                type="text"
                                                onChange={(e) => handleChange("educations", "minor", e.target.value, index)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Start Date <span className="req">*</span></label>
                                            <input 
                                                type="date" 
                                                onChange={(e) => handleChange("educations", "startDate", e.target.value, index)} 
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>End Date</label>
                                            <input 
                                                type="date" 
                                                onChange={(e) => handleChange("educations", "endDate", e.target.value, index)} 
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Add Another Education button */}
                                <button type="button" onClick={() => handleAddEntry("educations", {
                                    schoolName: "",
                                    degreeType: 0,
                                    gpa: null,
                                    major: "",
                                    minor: null,
                                    startDate: null,
                                    endDate: null,
                                })}>Add Education</button>
                            </section>
                        )}



                        <section>
                            <h3>Add a Section</h3>
                            <div className="inputs-ctnr">
                                <button type="button" className="section-btn" onClick={() => handleShowSection("experiences")}>Experiences</button>
                                <button type="button" className="section-btn" onClick={() => handleShowSection("educations")}>Educations</button>
                                <button type="button" className="section-btn" onClick={() => handleShowSection("certifications")}>Certifications</button>
                                <button type="button" className="section-btn" onClick={() => handleShowSection("projects")}>Projects</button>
                                <button type="button" className="section-btn" onClick={() => handleShowSection("skills")}>Skills</button>
                            </div>
                        </section>
                    </div>
                </form>
            </AuthorizeView>
        );
    }
}

export default ResumeBuilderTwo;