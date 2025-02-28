import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { RgbaColorPicker } from 'react-colorful';

import { API_BASE_URL } from '../utils/BaseUrl';
import AuthorizeView from '../components/AuthorizeView';
import { useUser } from '../context/UserContext';
import { showToast } from '../utils/Toast';
import { validateResume } from '../utils/ResumeValidator';
import { rgbaToString } from '../utils/ColorFormatter';
import AllTemplates from '../components/templates/AllTemplates';
import { templates, templateColors } from '../utils/TemplateList';
import '../stylesheets/ResumeBuilder.css';

// import: Stepper + Resume Sections
import Stepper from '../components/Stepper';
import GeneralInformation from '../components/resume-sections/GeneralInformation';
import Experiences from '../components/resume-sections/Experiences';
import Educations from '../components/resume-sections/Educations';
import Certifications from '../components/resume-sections/Certifications';
import Projects from '../components/resume-sections/Projects';
import Skills from '../components/resume-sections/Skills';


function ResumeBuilder() {
    const navigate = useNavigate();
    const params = useParams();
    const { user, userLoading } = useUser();
    const [currentStep, setCurrentStep] = useState(0);
    const [resumeData, setResumeData] = useState(null);
    const [templateId, setTemplateId] = useState(params.templateId);
    const [resumeColor, setResumeColor] = useState({ r: 0, g: 0, b: 0, a: 1 });
    const [resumeTextSize, setResumeTextSize] = useState(1);
    const [showColorButton, setShowColorButton] = useState(true);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showSizePicker, setShowSizePicker] = useState(false);
    const hiddenRef = useRef(null);
    const updateResumeId = params.resumeId;
    const colorInitialized = useRef(false);
    const textSizeInitialized = useRef(false);

    // When user data is available && user is creating a resume, initialize resumeData with default values
    useEffect(() => {
        if (user?.id && updateResumeId === undefined) {
            const username = user.firstName.toLowerCase() + user.lastName.toLowerCase();

            setResumeData({
                id: user.id,
                resumeName: "Untitled Document",
                currentDate: new Date(),
                templateId: templateId,
                colorJson: resumeColor,
                textSize: resumeTextSize,
                generalInformation: {
                    firstName: user.firstName,
                    middleName: null,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: "(123) 456-7890",
                    location: "Miami, FL",
                    role: "Job Title",
                    websiteUrl: `${username}.com`,
                    linkedInUrl: `linkedin.com/in/${username}`,
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
    }, [user, updateResumeId]);

    // Call fetchResume only when updateResumeId is defined and resumeData is null
    // (prevents redundant API calls)
    useEffect(() => {
        if (updateResumeId && !resumeData) { fetchResume(); }
    }, [updateResumeId, resumeData]);


    // Color logic
    useEffect(() => {
        // If creating a new resume ...
        if (updateResumeId == undefined) {
            if (templateId === "minimal") {
                setShowColorPicker(false);
                setShowColorButton(false);
            }
            else {
                setShowColorButton(true);
                if (templateColors[templateId]) {
                    setResumeColor(templateColors[templateId]);
                }
            }
        }
        else {
            setShowColorButton(templateId !== "minimal");
        }
    }, [templateId]);

    useEffect(() => {
        if (updateResumeId !== undefined && resumeData) {
            if (!colorInitialized.current) {
                setResumeColor(JSON.parse(resumeData.colorJson) || { r: 0, g: 0, b: 0, a: 1 });
                colorInitialized.current = true;
            }
            if (!textSizeInitialized.current) {
                setResumeTextSize(resumeData.textSize || 1);
                textSizeInitialized.current = true;
            }
        }
    }, [resumeData, updateResumeId]);


    // Close color picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".color-picker-ctnr")) {
                setShowColorPicker(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Close text size picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".textsize-ctnr")) {
                setShowSizePicker(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);


    const handleChangeResumeData = (section, sectionData) => {
        console.log(section.name + "                   " + sectionData)
        setResumeData((prevResume) => ({
            ...prevResume,
            [section]: sectionData,  // Dynamically update the section
        }));
    };

    const fetchResume = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Resume/GetResumeById/${updateResumeId}`);

            if (!response.ok) {
                showToast("Failed to fetch resume", "error");
                throw new Error(`Failed to fetch resume. Status: ${response.status}`);
            }

            const data = await response.json();
            data.updatedDateTime = new Date();
            data.skills.skillsDataJson = JSON.parse(data.skills?.skillsDataJson || "{}");

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
            console.log(section + "  " + index+ "    " +  field + "    " + value + "   ");
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

    const handleReorderCategories = (newOrder) => {
        setResumeData((prevResume) => ({
            ...prevResume,
            skills: {
                ...prevResume.skills,
                skillsDataJson: { ...newOrder },
            },
        }));
    };

    const handleAddSkillCategory = (category) => {
        category = String(category).trim();

        // Add a prefix if it's a number to prevent JavaScript auto-sorting
        if (!isNaN(category)) {
            category = `Category_${category}`;
        }

        setResumeData((prevResume) => {
            const updatedSkills = { ...prevResume.skills.skillsDataJson };

            if (!updatedSkills[category]) {
                updatedSkills[category] = new Set();
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

            if (Array.isArray(updatedSkills[category])) {
                updatedSkills[category] = new Set(updatedSkills[category]);
            }

            updatedSkills[category].add(skill);

            return {
                ...prevResume,
                skills: {
                    ...prevResume.skills,
                    skillsDataJson: Object.fromEntries(
                        Object.entries(updatedSkills).map(([key, value]) => [key, [...value]])
                    )
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
                // Ensure the category value is an array (not a Set)
                updatedSkills[category] = Array.isArray(updatedSkills[category])
                    ? updatedSkills[category].filter(s => s !== skill) // Remove the skill
                    : [...updatedSkills[category]].filter(s => s !== skill); // Convert Set to array, then remove skill
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

    const handleChangeColor = (newColor) => {
        setResumeColor(newColor);
    }

    const handleResetColor = () => {
        // Minimal doesn't have color ...
        if (templateId === "bold-navy") { setResumeColor({ r: 0, g: 0, b: 128, a: 1 }); }  // rgba(0, 0, 128, 1) 
        else if (templateId === "skyline") { setResumeColor({ r: 165, g: 206, b: 241, a: 1 }); }  // rgba(165, 206, 241, 1)
        else if (templateId === "rosy-edge") { setResumeColor({ r: 255, g: 210, b: 210, a: 1 }); }  // rgba(255, 228, 228, 1)
        else if (templateId === "beeline") { setResumeColor({ r: 255, g: 215, b: 0, a: 1 }); }  // rgba(255, 215, 0, 1)
    }

    const handleChangeTextSize = (event) => {
        setResumeTextSize(event.target.value);
    }

    const handleResetTextSize = () => {
        setResumeTextSize(1);
    }

    const generateResumeThumbnail = async () => {
        try {
            if (!hiddenRef.current) return null;

            // Render AllTemplates inside hidden container
            const root = createRoot(hiddenRef.current);
            root.render(
                <AllTemplates 
                    selectedTemplate={resumeData.templateId}
                    resumeData={resumeData}
                    color={resumeColor}
                    textSize={resumeTextSize} 
                />
            );

            await new Promise((resolve) => setTimeout(resolve, 500));

            // Capture as Image
            const canvas = await html2canvas(hiddenRef.current, {
                backgroundColor: "#FFFFFF",
                scale: 2,
                useCORS: true
            });

            const imgData = canvas.toDataURL("image/png");

            root.unmount();

            return imgData;
        } catch (error) {
            console.error("Error generating resume thumbnail:", error);
            return null;
        }
    };

    const handleSubmit = async () => {
        try {
            const imgData = await generateResumeThumbnail();

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
                },
                thumbnail: imgData,
                colorJson: JSON.stringify(resumeColor),
                textSize: resumeTextSize
            };

            // console.log("Sending Data: ", JSON.stringify(processedResumeData, null, 2));

            // If new resume...
            if (updateResumeId == undefined) {
                const response = await fetch(`${API_BASE_URL}/api/Resume/Create`, {
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
                const response = await fetch(`${API_BASE_URL}/api/Resume/Update/${updateResumeId}`, {
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
                        {/* Template preview */}
                        <TransformWrapper
                            initialScale={.5}
                            minScale={.5}
                            centerOnInit
                        >
                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                <React.Fragment>
                                    <div className="zoom-tools">
                                        <motion.button
                                            type="button"
                                            className="zoom-btn"
                                            onClick={() => zoomIn()}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <img src="/assets/icons/zoom-in.svg" className="icon-dynamic" draggable="false" />
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            className="zoom-btn"
                                            onClick={() => zoomOut()}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <img src="/assets/icons/zoom-out.svg" className="icon-dynamic" draggable="false" />
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            className="reset-btn"
                                            onClick={() => resetTransform()}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            Reset
                                        </motion.button>
                                    </div>
                                    <TransformComponent>
                                        <AllTemplates
                                            selectedTemplate={templateId}
                                            resumeData={resumeData}
                                            color={resumeColor}
                                            textSize={resumeTextSize}
                                        />
                                    </TransformComponent>
                                </React.Fragment>
                            )}
                        </TransformWrapper>

                        {/* Resume actions */}
                        <div className="resume-actions">
                            <div className="actions-div">
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
                                <div className="color-picker-ctnr">
                                    {showColorButton && (
                                        <motion.button
                                            type="button"
                                            className="color-btn"
                                            style={{ background: `rgba(${resumeColor.r}, ${resumeColor.g}, ${resumeColor.b}, ${resumeColor.a})` }}
                                            onClick={() => setShowColorPicker(!showColorPicker)}
                                            whileTap={{ scale: 0.8 }}
                                        ></motion.button>
                                    )}
                                    <AnimatePresence>
                                        {showColorPicker && (
                                            <motion.div
                                                className="color-picker"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                            >
                                                <div className="rgb-txt">{rgbaToString(resumeColor)}</div>
                                                <RgbaColorPicker color={resumeColor} onChange={handleChangeColor} />
                                                <button type="button" className="btn btn-outline" onClick={handleResetColor}>Reset to Default</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="textsize-ctnr">
                                    <motion.button
                                        type="button"
                                        className="textsize-btn"
                                        onClick={() => setShowSizePicker(!showSizePicker)}
                                        whileTap={{ scale: 0.8 }}
                                    >
                                        <img src="/assets/icons/text.svg" className="icon-dynamic" draggable="false" />
                                    </motion.button>
                                    <AnimatePresence>
                                        {showSizePicker && (
                                            <motion.div 
                                                className="textsize-picker"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                            >
                                                <div className="size-txt">Text Size:&nbsp; {resumeTextSize * 100}%</div>
                                                <input 
                                                    type="range"
                                                    className="textsize-slider"
                                                    min={.7}
                                                    max={1} 
                                                    step={.01}
                                                    value={resumeTextSize}
                                                    onChange={handleChangeTextSize}
                                                />
                                                <button type="button" className="btn btn-outline" onClick={handleResetTextSize}>Reset to Default</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="actions-div">
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
                                    <span>Save</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="build-view">
                        {/* Stepper section buttons */}
                        <div className="stepper-ctnr">
                            <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />
                        </div>

                        {/* Stepper content */}
                        <div className="step-content">
                            {currentStep === 0 && <GeneralInformation data={resumeData.generalInformation} handleChange={handleChange} />}
                            {currentStep === 1 && <Experiences data={resumeData.experiences} handleChange={handleChange} handleAddEntry={handleAddEntry} handleRemoveEntry={handleRemoveEntry} handleChangeResumeData={handleChangeResumeData} />}
                            {currentStep === 2 && <Educations data={resumeData.educations} handleChange={handleChange} handleAddEntry={handleAddEntry} handleRemoveEntry={handleRemoveEntry} handleChangeResumeData={handleChangeResumeData} />}
                            {currentStep === 3 && <Certifications data={resumeData.certifications} handleChange={handleChange} handleAddEntry={handleAddEntry} handleRemoveEntry={handleRemoveEntry} handleChangeResumeData={handleChangeResumeData} />}
                            {currentStep === 4 && <Projects data={resumeData.projects} handleChange={handleChange} handleAddEntry={handleAddEntry} handleRemoveEntry={handleRemoveEntry} handleChangeResumeData={handleChangeResumeData} />}
                            {currentStep === 5 && <Skills data={resumeData.skills} handleReorderCategories={handleReorderCategories} handleAddSkillCategory={handleAddSkillCategory} handleRemoveSkillCategory={handleRemoveSkillCategory} handleAddSkill={handleAddSkill} handleRemoveSkill={handleRemoveSkill} />}
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

                {/*Hidden container for thumbnail generation */}
                <div ref={hiddenRef} style={{ position: "absolute", left: "-9999px", width: "800px", height: "1100px", overflow: "hidden", backgroundColor: "white" }} />
            </AuthorizeView>
        );
    }
}

export default ResumeBuilder;