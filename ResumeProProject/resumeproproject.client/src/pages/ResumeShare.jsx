import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import AllTemplates from '../components/templates/AllTemplates';
import { API_BASE_URL } from '../utils/BaseUrl';
import { showToast } from '../utils/Toast';
import '../stylesheets/ResumeShare.css';

function ResumeShare() {
    const { resumeId } = useParams();
    const [resumeData, setResumeData] = useState(null);

    // Get resume function
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/Resume/GetResumeById/${resumeId}`);

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
            }
            catch (error) {
                console.error("Error fetching resume:", error);
                showToast("Failed to fetch resume", "error");
            }
        };

        fetchResume();
    }, [resumeId]);

    if (!resumeData) return <div className="loading-spinner"></div>;

    return (
        <div className="page-ctnr">
            <motion.div 
                className="resume-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div>
                    <AllTemplates 
                        selectedTemplate={resumeData.templateId} 
                        resumeData={resumeData} 
                        color={JSON.parse(resumeData.colorJson)} 
                        textSize={resumeData.textSize} 
                    />
                </div>
            </motion.div>
        </div>
    )
}

export default ResumeShare;