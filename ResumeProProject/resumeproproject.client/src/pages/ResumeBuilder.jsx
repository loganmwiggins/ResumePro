import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/ResumeBuilder.css';
import AuthorizeView from '../components/AuthorizeView';
import { useUser } from "../context/UserContext";
import { showToast } from '../utils/Toast';

function ResumeBuilder() {
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [resumeData, setResumeData] = useState(null);

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
                experiences: [
                    {
                        companyName: null,
                        role: null,
                        startDate: new Date().toISOString().split("T")[0],
                        endDate: null,
                        isCurrent: false,
                        description: null,
                        location: null,
                        officeType: 1,
                        jobType: 1
                    }
                ],
                skills: {
                    skillsDataJson: "[]"
                }
            });
        }
    }, [user]); // Runs whenever 'user' changes

    const handleChange = (event) => {
        const { name, value } = event.target;       // Destructuring 'name' and 'value' attributes from the input field

        setResumeData(prevData => ({
            ...prevData,
            [name]: prevData.hasOwnProperty(name) ? value : prevData[name],     // Update resumeName directly if it exists
            generalInformation: {
                ...prevData.generalInformation,     // Preserves previous state of general info data
                [name]: prevData.generalInformation.hasOwnProperty(name) ? value : prevData.generalInformation[name]  // Update generalInformation fields
            }
        }));
    };

    const handleExperienceChange = (index, event) => {
        const { name, value, type, checked } = event.target;                            // Destructuring input field

        setResumeData(prevData => {
            const updatedExperiences = [...prevData.experiences];                       // Create a copy of the experiences array
            updatedExperiences[index][name] = type === "checkbox" ? checked : value;    // Update exp at index, if checkbox update with checked, otherwise use value
            return {
                ...prevData,
                experiences: updatedExperiences
            };
        });
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
                        {/* General Information */}
                        <section id="general-information">
                            <h3>General Information</h3>
                            <div className="inputs-ctnr">
                                <div className="input-field">
                                    <label>First Name <span className="req">*</span></label>
                                    <input type="text" name="firstName" placeholder="Enter First Name" value={resumeData.generalInformation.firstName} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Middle Name</label>
                                    <input type="text" name="middleName" placeholder="Enter Middle Name" value={resumeData.generalInformation.middleName} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Last Name <span className="req">*</span></label>
                                    <input type="text" name="lastName" placeholder="Enter Last Name" value={resumeData.generalInformation.lastName} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Email</label>
                                    <input type="email" name="email" placeholder="Enter Email" value={resumeData.generalInformation.email} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Phone Number</label>
                                    <input type="text" name="phoneNumber" placeholder="Enter Phone Number" value={resumeData.generalInformation.phoneNumber} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Website URL</label>
                                    <input type="text" name="websiteUrl" placeholder="Enter Website URL" value={resumeData.generalInformation.websiteUrl} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>LinkedIn URL</label>
                                    <input type="text" name="linkedInUrl" placeholder="Enter LinkedIn URL" value={resumeData.generalInformation.linkedInUrl} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>GitHub URL</label>
                                    <input type="text" name="gitHubUrl" placeholder="Enter GitHub URL" value={resumeData.generalInformation.gitHubUrl} onChange={handleChange} />
                                </div>
                            </div>
                        </section>
                        
                        {/* Experience */}
                        <section id="experience">
                            <h3>Experience</h3>
                            <div className="inputs-ctnr">
                                {resumeData.experiences.map((experience, index) => (
                                    <div key={index} className="experience-entry">
                                        <div className="input-field">
                                            <label>Company / Employer <span className="req">*</span></label>
                                            <input type="text" name="companyName" placeholder="Enter Company Name" value={experience.companyName} onChange={(e) => handleExperienceChange(index, e)} />
                                        </div>
                                        <div className="input-field">
                                            <label>Role <span className="req">*</span></label>
                                            <input type="text" name="role" placeholder="Enter Role" value={experience.role} onChange={(e) => handleExperienceChange(index, e)} />
                                        </div>
                                        <div className="input-field">
                                            <label>Start Date <span className="req">*</span></label>
                                            <input type="date" name="startDate" value={experience.startDate} onChange={(e) => handleExperienceChange(index, e)} />
                                        </div>
                                        <div className="input-field">
                                            <label>End Date</label>
                                            <input type="date" name="endDate" value={experience.endDate} onChange={(e) => handleExperienceChange(index, e)} />
                                        </div>
                                        <div className="input-field">
                                            <label>Is Current? <span className="req">*</span></label>
                                            <input type="checkbox" name="isCurrent" checked={experience.isCurrent} onChange={(e) => handleExperienceChange(index, e)} />
                                        </div>
                                        <div className="input-field">
                                            <label>Description <span className="req">*</span></label>
                                            <input type="textarea" name="description" placeholder="What did you do?" value={experience.description} onChange={(e) => handleExperienceChange(index, e)} />
                                        </div>
                                        <div className="input-field">
                                            <label>Location</label>
                                            <input type="text" name="location" placeholder="City, State" value={experience.location} onChange={(e) => handleExperienceChange(index, e)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </form>
            </AuthorizeView>
        );
    }
}

export default ResumeBuilder;