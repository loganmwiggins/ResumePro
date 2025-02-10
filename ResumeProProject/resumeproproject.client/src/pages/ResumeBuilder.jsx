import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import '../stylesheets/ResumeBuilder.css';
import AuthorizeView from '../components/AuthorizeView';
import { useUser } from "../context/UserContext";
import { showToast } from '../utils/Toast';
import AllTemplates from '../components/Templates/AllTemplates';

// import: Stepper + Resume Sections
import Stepper from "../components/Stepper";
import GeneralInformation from "../components/ResumeSections/GeneralInformation";
import Experiences from "../components/ResumeSections/Experiences";
import Educations from "../components/ResumeSections/Educations";
import Certifications from "../components/ResumeSections/Certifications";
import Projects from "../components/ResumeSections/Projects";
import Skills from "../components/ResumeSections/Skills";


function ResumeBuilder() {
    const navigate = useNavigate();
    const params = useParams();
    const { user, loading } = useUser();
    const resumeRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [resumeData, setResumeData] = useState(null);

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
    }, [user]); // Runs whenever 'user' changes

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 5));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

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

    const handleNameChange = (newName) => {
        setResumeData((prevResume) => {
            return {
                ...prevResume,
                resumeName: newName
            }
        })
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
        showToast("Resume abandoned.", "warning");
        navigate("/home");
    }

    const handleSubmit = async () => {
        try {
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

        } catch (error) {
            console.error("Error:", error);
            showToast(error.message, "error");
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
                            <AllTemplates selectedTemplate={templateId} resumeData={resumeData} viewMode="builder" />
                        </div>
                        <div className="resume-actions">
                            <input 
                                type="text"
                                placeholder="Name your document!"
                                value={resumeData.resumeName} 
                                onChange={(e) => handleNameChange(e.target.value)} 
                            />
                            <button type="button" onClick={handleCancel}>Cancel</button>
                            <button type="submit">Save Resume</button>
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
                                className={currentStep === 0 ? "btn-disabled" : ""}
                                onClick={handleBack}
                                whileTap={{ scale: 0.9 }}
                            >
                                Back
                            </motion.button>

                            <motion.button
                                type="button"
                                className={currentStep === 5 ? "btn-disabled" : ""}
                                onClick={handleNext}
                                whileTap={{ scale: 0.9 }}
                            >
                                Next
                            </motion.button>
                        </div>
                    </div>
                </form>
            </AuthorizeView>
        );
    }
}

export default ResumeBuilder;