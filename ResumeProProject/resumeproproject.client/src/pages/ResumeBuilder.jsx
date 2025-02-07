import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";  // Import PDF library

import '../stylesheets/ResumeBuilder.css';
import AuthorizeView from '../components/AuthorizeView';
import { useUser } from "../context/UserContext";
import { showToast } from '../utils/Toast';
import Select from "react-select";
import AllTemplates from '../components/Templates/AllTemplates';

function ResumeBuilder() {
    const navigate = useNavigate();
    const params = useParams();
    const { user, loading } = useUser();
    const resumeRef = useRef(null);
    const [template, setTemplate] = useState([]);
    const [resumeData, setResumeData] = useState(null);

    const [visibleSections, setVisibleSections] = useState("generalInformation");

    // Extract templateId from URL
    const templateId = params.templateId;

    // When user data is available, initialize resumeData with default values
    useEffect(() => {
        if (user?.id) {
            setResumeData({
                id: user.id,
                resumeName: "Untitled Document",
                currentDate: new Date(),
                templateId: templateId,
                generalInformation: {
                    firstName: "John",
                    middleName: null,
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    phoneNumber: "(123) 456-7890",
                    location: "Miami, FL",
                    websiteUrl: "johndoe.com",
                    linkedInUrl: "linkedin.com/in/johndoe",
                    gitHubUrl: null
                },
                skills: {
                    skillsDataJson: {}
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

    const handleAddSkillCategory = (category) => {
        setResumeData((prevResume) => {
            const updatedSkills = { ...prevResume.skills.skillsDataJson };
    
            if (!updatedSkills[category]) {
                updatedSkills[category] = new Set(); // Use a Set to avoid duplicates
            }
    
            return {
                ...prevResume,
                skills: {
                    ...prevResume.skills,
                    skillsDataJson: updatedSkills
                }
            };
        });
    };
    
    const handleAddSkill = (category, skill) => {
        setResumeData((prevResume) => {
            const updatedSkills = { ...prevResume.skills.skillsDataJson };
    
            if (!updatedSkills[category]) {
                updatedSkills[category] = new Set();
            }
    
            updatedSkills[category].add(skill);
    
            return {
                ...prevResume,
                skills: {
                    ...prevResume.skills,
                    skillsDataJson: updatedSkills
                }
            };
        });
    };
    
    const handleRemoveSkill = (category, skill) => {
        setResumeData((prevResume) => {
            const updatedSkills = { ...prevResume.skills.skillsDataJson };
    
            if (updatedSkills[category]) {
                updatedSkills[category].delete(skill);
    
                // Remove category if empty
                if (updatedSkills[category].size === 0) {
                    delete updatedSkills[category];
                }
            }
    
            return {
                ...prevResume,
                skills: {
                    ...prevResume.skills,
                    skillsDataJson: updatedSkills
                }
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

    const generatePDF = () => {
        const element = resumeRef.current;

        // Clone the resume element in memory (NOT appending it to the DOM)
        const clonedElement = element.cloneNode(true);

        const printStyles = document.createElement("style");
        printStyles.innerHTML = `
        .resume-paper {
            width: 980px  important; /* A4 width */
            height: 400px !important; /* A4 width */
            transform: scale(1.3) !important; /* Prevent unexpected resizing */
            transform-origin: top left !important;
        }
    `;

        clonedElement.appendChild(printStyles);

        html2pdf()
            .set({
                filename: `${resumeData.resumeName || "Resume"}.pdf`,
                image: { type: "jpeg", quality: 1 },
                html2canvas: {
                    scale: 5, 
                    dpi: 300,
                    useCORS: true
                },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .from(clonedElement)
            .toPdf()
            .save();
    };


    const officeTypeOptions = [
        { value: 0, label: "On-site" },
        { value: 2, label: "Hybrid" },
        { value: 1, label: "Remote" }
    ];
    const jobTypeOptions = [
        { value: 0, label: "Full-time" },
        { value: 1, label: "Part-time" },
        { value: 3, label: "Internship" },
        { value: 2, label: "Volunteer" }
    ];
    // [POST] to Create Resume from form
    const handleSubmit = async (s) => {
        const processedResumeData = {
            ...resumeData,
            skills: {
                ...resumeData.skills,
                skillsDataJson: JSON.stringify(
                    Object.fromEntries(
                        Object.entries(resumeData.skills.skillsDataJson).map(([key, value]) => [key, [...value]])
                    )
                )
            }
        };

        console.log("Sending Data: ", JSON.stringify(processedResumeData, null, 2));

        try {
            const response = await fetch("https://localhost:7035/api/Resume/Create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(processedResumeData),
            });
            
            if (response.ok) {
                // const data = await response.json();
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
                        <div ref={resumeRef} className="resume-ctnr">
                            <AllTemplates selectedTemplate={templateId} resumeData={resumeData}></AllTemplates>
                        </div>
                        <div className="resume-actions">
                            <input type="text" name="resumeName" placeholder="Name of Document" value={resumeData.resumeName} onChange={handleChange} />
                            <button type="button" onClick={handleCancel}>Cancel</button>
                            <button type="submit">Save Resume</button>
                            <button type="button" onClick={generatePDF}>Download PDF</button>
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
                                        value={resumeData.generalInformation.firstName}
                                        placeholder="EX:  John"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Middle Name / Initial</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange("generalInformation", "middleName", e.target.value)}
                                        placeholder="EX:  Elizabeth / E"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Last Name <span className="req">*</span></label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange("generalInformation", "lastName", e.target.value)} 
                                        value={resumeData.generalInformation.lastName}
                                        placeholder="EX:  Doe"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        onChange={(e) => handleChange("generalInformation", "email", e.target.value)}
                                        value={resumeData.generalInformation.email}
                                        placeholder="EX:  john.doe@example.com"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        onChange={(e) => handleChange("generalInformation", "phoneNumber", e.target.value)}
                                        value={resumeData.generalInformation.phoneNumber}
                                        placeholder="EX:  (123) 456-7890"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        onChange={(e) => handleChange("generalInformation", "location", e.target.value)}
                                        value={resumeData.generalInformation.location}
                                        placeholder="EX:  Miami, FL"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Website URL</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange("generalInformation", "websiteUrl", e.target.value)}
                                        value={resumeData.generalInformation.websiteUrl}
                                        placeholder="EX:  johndoe.com"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>LinkedIn URL</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange("generalInformation", "linkedInUrl", e.target.value)}
                                        value={resumeData.generalInformation.linkedInUrl}
                                        placeholder="EX:  linkedin.com/in/johndoe"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>GitHub URL</label>
                                    <input
                                        type="text"
                                        onChange={(e) => handleChange("generalInformation", "gitHubUrl", e.target.value)}
                                        placeholder="EX:  github.com/johndoe"
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

                                        <Select
                                            options={jobTypeOptions}
                                            defaultValue={jobTypeOptions[0]}
                                            onChange={(selectedOption) => handleChange("experiences", "jobType", selectedOption.value, index)}
                                        />
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
                                        <Select
                                            options={officeTypeOptions}
                                            defaultValue={officeTypeOptions[0]}
                                            onChange={(selectedOption) => handleChange("experiences", "officeType", selectedOption.value, index)}
                                        />
                                    </div>
                                ))}
                                
                                {/* Add Experience button */}
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
                                            <label>Degree Type</label>
                                            <input 
                                                type="text"
                                                onChange={(e) => handleChange("educations", "degreeType", e.target.value, index)}
                                                placeholder="(e.g., Bachelor of Science)"
                                            />
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

                                {/* Add Education button */}
                                <button type="button" onClick={() => handleAddEntry("educations", {
                                    schoolName: "",
                                    degreeType: "",
                                    gpa: null,
                                    major: "",
                                    minor: null,
                                    startDate: null,
                                    endDate: null,
                                })}>Add Education</button>
                            </section>
                        )}


                        {/* CERTIFICATIONS */}
                        {visibleSections.includes("certifications") && (
                            <section>
                                <h3>Certifications</h3>

                                {/* Certification entry */}
                                {resumeData.certifications.map((cert, index) => (
                                    <div className="inputs-ctnr" key={index}>
                                        <h4>#{index+1} - {resumeData.certifications[index].name}</h4>
                                        <div className="input-field">
                                            <label>Name <span className="req">*</span></label>
                                            <input 
                                                type="text"
                                                onChange={(e) => handleChange("certifications", "name", e.target.value, index)}
                                                placeholder="Name of certification (e.g., Azure Fundamentals)"
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Issuer <span className="req">*</span></label>
                                            <input 
                                                type="text"
                                                placeholder="Name of issuer (e.g., Microsoft)"
                                                onChange={(e) => handleChange("certifications", "issuer", e.target.value, index)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Issue Date <span className="req">*</span></label>
                                            <input 
                                                type="date" 
                                                onChange={(e) => handleChange("certifications", "issueDate", e.target.value, index)} 
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Expire Date</label>
                                            <input 
                                                type="date" 
                                                onChange={(e) => handleChange("certifications", "expireDate", e.target.value, index)} 
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Add Certification button */}
                                <button type="button" onClick={() => handleAddEntry("certifications", {
                                    name: null,
                                    issuer: null,
                                    issueDate: null,
                                    expireDate: null
                                })}>Add Certification</button>
                            </section>
                        )}


                        {/* PROJECTS */}
                        {visibleSections.includes("projects") && (
                            <section>
                                <h3>Projects</h3>

                                {/* Project entry */}
                                {resumeData.projects.map((proj, index) => (
                                    <div className="inputs-ctnr" key={index}>
                                        <h4>#{index+1}</h4>
                                        <div className="input-field">
                                            <label>Title <span className="req">*</span></label>
                                            <input 
                                                type="text"
                                                placeholder="Name of project (e.g., Weather App)"
                                                onChange={(e) => handleChange("projects", "title", e.target.value, index)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Description <span className="req">*</span></label>
                                            <input 
                                                type="textarea"
                                                placeholder="What did you do?"
                                                onChange={(e) => handleChange("projects", "description", e.target.value, index)}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Start Date <span className="req">*</span></label>
                                            <input 
                                                type="date" 
                                                onChange={(e) => handleChange("projects", "startDate", e.target.value, index)} 
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>End Date</label>
                                            <input 
                                                type="date" 
                                                onChange={(e) => handleChange("projects", "endDate", e.target.value, index)} 
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Add Project button */}
                                <button type="button" onClick={() => handleAddEntry("projects", {
                                    title: null,
                                    description: null,
                                    startDate: null,
                                    endDate: null
                                })}>Add Project</button>
                            </section>
                        )}


                        {/* SKILLS */}
                        {visibleSections.includes("skills") && (
                            <section>
                                <h3>Skills</h3>
                                
                                {/* Add new category */}
                                <div className="input-field">
                                    <label>New Skill Category</label>
                                    <input type="text" id="newCategoryInput" />
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const category = document.getElementById("newCategoryInput").value;
                                            if (category) {
                                                handleAddSkillCategory(category);
                                                document.getElementById("newCategoryInput").value = "";
                                            }
                                        }}
                                    >
                                        Add Category
                                    </button>
                                </div>

                                {/* Render categories and skills */}
                                {Object.entries(resumeData.skills.skillsDataJson).map(([category, skills]) => (
                                    <div key={category} className="skill-category">
                                        <h4>{category}</h4>
                                        
                                        {/* Add skill input */}
                                        <div className="input-field">
                                            <input type="text" id={`skillInput-${category}`} />
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const skill = document.getElementById(`skillInput-${category}`).value;
                                                    if (skill) {
                                                        handleAddSkill(category, skill);
                                                        document.getElementById(`skillInput-${category}`).value = "";
                                                    }
                                                }}
                                            >
                                                Add Skill
                                            </button>
                                        </div>

                                        {/* Display Skills */}
                                        <ul>
                                            {[...skills].map((skill) => (
                                                <li key={skill}>
                                                    {skill} 
                                                    <button onClick={() => handleRemoveSkill(category, skill)}>Remove</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
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

export default ResumeBuilder;