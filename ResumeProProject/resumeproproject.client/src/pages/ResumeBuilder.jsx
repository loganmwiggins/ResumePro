import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

import '../stylesheets/ResumeBuilder.css';
import AuthorizeView from '../components/AuthorizeView';
import { useUser } from '../context/UserContext';
import { showToast } from '../utils/Toast';
import { validateResume } from '../utils/ResumeValidator';
import AllTemplates from '../components/Templates/AllTemplates';
import { templates } from '../utils/TemplateList';

// import: Stepper + Resume Sections
import Stepper from '../components/Stepper';
import GeneralInformation from '../components/ResumeSections/GeneralInformation';
import Experiences from '../components/ResumeSections/Experiences';
import Educations from '../components/ResumeSections/Educations';
import Certifications from '../components/ResumeSections/Certifications';
import Projects from '../components/ResumeSections/Projects';
import Skills from '../components/ResumeSections/Skills';


function ResumeBuilder() {
    const navigate = useNavigate();
    const params = useParams();
    const { user, userLoading } = useUser();
    const resumeRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [resumeData, setResumeData] = useState(null);
    const [templateId, setTemplateId] = useState(params.templateId);

    const updateResumeId = params.resumeId;

    // When user data is available, initialize resumeData with default values
    useEffect(() => {
        if (user?.id) {
            // If creating a new resume...
            if (updateResumeId == undefined) {
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
                        role: "Software Engineer",
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
            // If updating a resume...
            else {
                fetchResume();
            }
        }
    }, [user]); // Runs whenever 'user' changes

    const fetchResume = async () => {
        try {
            const response = await fetch(`https://localhost:7035/api/Resume/GetResumeById/${updateResumeId}`);

            if (!response.ok) {
                showToast("Failed to fetch resume", "error");
                throw new Error(`Failed to fetch resume. Status: ${response.status}`);
            }

            const data = await response.json();
            data.updatedDateTime = new Date();
            if (data.skills?.skillsDataJson) {
                try {
                    data.skills.skillsDataJson = JSON.parse(data.skills.skillsDataJson);
                } catch (error) {
                    console.error("Error parsing skillsDataJson:", error);
                    data.skills.skillsDataJson = {};
                }
            }

            setResumeData(data);
        }
        catch (error) {
            console.error("Error fetching resume:", error);
            showToast("Failed to fetch resume", "error");
        }
    };

    const handleTemplateChange = (template) => {
        setTemplateId(template);
        setResumeData((prevResume) => {
            return {
                ...prevResume,
                templateId: template
            }
        });
    }

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 5));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleChange = (section, field, value, index = null) => {
       // console.log(`Updating ${section}[${index}].${field} to:`, value);
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

    const handleNameChange = (newName) => {
        setResumeData((prevResume) => {
            return {
                ...prevResume,
                resumeName: newName
            }
        });
    }

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

    const handleRemoveSkillCategory = (category) => {
        setResumeData((prevResume) => {
            const updatedSkills = { ...prevResume.skills.skillsDataJson };

            delete updatedSkills[category];

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

    const handleRemoveEntry = (section, index) => {
        setResumeData((prevResume) => ({
            ...prevResume,
            [section]: prevResume[section].filter((_, i) => i !== index),
        }));
    };
    
    const handleCancel = () => {
        showToast("Changes were not saved", "warning", "Resume Abandoned");
        navigate("/home");
    }

    const handleSubmit = async () => {
        try {
            //  Create hidden clone to prevent layout shifts
            const clone = resumeRef.current.cloneNode(true);
            clone.style.transform = "scale(1)";
            clone.style.width = "450px";
            clone.style.height = "auto";
            clone.style.position = "absolute";
            clone.style.left = "-9999px";
            document.body.appendChild(clone);

            const canvas = await html2canvas(clone, {
                backgroundColor: "#FFFFFF",
                scale: 5,
                useCORS: true,
            });

            const imgData = canvas.toDataURL("image/png");

            //  Remove  clone 
            document.body.removeChild(clone);

            // Validate the resume and stop execution if invalid
            if (!validateResume(resumeData)) return;

            const processedResumeData = {
                ...resumeData,
                skills: {
                    ...resumeData.skills,
                    skillsDataJson: JSON.stringify(
                        Object.fromEntries(
                            Object.entries(resumeData.skills.skillsDataJson).map(([key, value]) => [key, [...value]])
                        )
                    )
                }, thumbnail: imgData,
            };

            //  console.log("Sending Data: ", JSON.stringify(processedResumeData, null, 2));

            // If new resume...
            if (updateResumeId == undefined) {
                const response = await fetch("https://localhost:7035/api/Resume/Create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(processedResumeData),
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to create resume. Status: ${response.status}`);
                }
    
                const responseText = await response.text(); // Read response as text
    
                let responseData;
                try {
                    responseData = JSON.parse(responseText); // Convert to JSON
                } catch (error) {
                    throw new Error("API did not return valid JSON.");
                }
    
                if (!responseData.resumeId) {
                    throw new Error("resumeId is missing in API response.");
                }
    
                navigate(`/preview/${responseData.resumeId}`);
            }
            // If updating...
            else {
                const response = await fetch(`https://localhost:7035/api/Resume/Update/${updateResumeId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(processedResumeData),
                });

                if (!response.ok) {
                    showToast("Failed to update resume.", "error");
                    throw new Error(`Failed to update resume. Status: ${response.status}`);
                }
    
                navigate(`/preview/${updateResumeId}`);
            }
        } 
        catch (error) {
            console.error("Error:", error);
            showToast(error.message, "error");
        }
    };


    if (userLoading || !resumeData) {
        return <div className="loading-spinner"></div>;
    }
    else {
        return (
            <AuthorizeView>
                <form className="builder-ctnr" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    {/* LEFT SIDE */}
                    <div className="template-view">
                        <div ref={resumeRef} className="resume-ctnr">
                            <AllTemplates selectedTemplate={templateId} resumeData={resumeData} viewMode="builder" />
                        </div>
                        <div className="resume-actions">
                            <input 
                                type="text"
                                placeholder="Name your document!"
                                value={resumeData.resumeName} 
                                onChange={(e) => handleNameChange(e.target.value)}
                                required
                            />
                            <select value={templateId} onChange={(event) => handleTemplateChange(event.target.value)}>
                                {/* Dynamically populated from TemplateList.jsx */}
                                {templates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>

                            <motion.button 
                                type="button" 
                                className="btn btn-outline" 
                                onClick={handleCancel}
                                whileTap={{ scale: 0.9 }}
                            >
                                <span>Cancel</span>
                            </motion.button>
                            <motion.button 
                                type="submit" 
                                className="btn btn-blue"
                                whileTap={{ scale: 0.9 }}
                            >
                                <span>Save Resume</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="build-view">
                        {/* Stepper section buttons */}
                        <div className="stepper-ctnr">
                            <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep}/>
                        </div>

                        {/* Stepper content */}
                        <div className="step-content">
                            {currentStep === 0 && <GeneralInformation data={resumeData.generalInformation} handleChange={handleChange} />}
                            {currentStep === 1 && <Experiences data={resumeData.experiences} handleChange={handleChange} handleAddEntry={handleAddEntry} handleRemoveEntry={handleRemoveEntry} />}
                            {currentStep === 2 && <Educations data={resumeData.educations} handleChange={handleChange} handleAddEntry={handleAddEntry} handleRemoveEntry={handleRemoveEntry} />}
                            {currentStep === 3 && <Certifications data={resumeData.certifications} handleChange={handleChange} handleAddEntry={handleAddEntry} handleRemoveEntry={handleRemoveEntry} />}
                            {currentStep === 4 && <Projects data={resumeData.projects} handleChange={handleChange} handleAddEntry={handleAddEntry} handleRemoveEntry={handleRemoveEntry} />}
                            {currentStep === 5 && <Skills data={resumeData.skills} handleAddSkillCategory={handleAddSkillCategory} handleRemoveSkillCategory={handleRemoveSkillCategory} handleAddSkill={handleAddSkill} handleRemoveSkill={handleRemoveSkill} />}
                        </div>

                        <div className="build-footer">
                            <motion.button
                                type="button"
                                className={`btn btn-outline ${currentStep === 0 ? "btn-disabled" : ""}`}
                                onClick={handleBack}
                                whileTap={{ scale: 0.9 }}
                            >
                                <span>Back</span>
                            </motion.button>
                            
                            {currentStep != 5 ? 
                                (
                                    <motion.button
                                        type="button"
                                        className="btn btn-black"
                                        onClick={handleNext}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <span>Next</span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={(e) => { e.preventDefault(); handleSubmit(); }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <img src="/assets/icons/check.svg" draggable="false" />
                                        <span>Finish & Save</span>
                                    </motion.button>
                                )
                            }
                        </div>
                    </div>
                </form>
            </AuthorizeView>
        );
    }
}

export default ResumeBuilder;