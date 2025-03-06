import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { showToast } from '../utils/Toast';
import DOMPurify from 'dompurify';

import AllTemplates from '../components/templates/AllTemplates';
import DescriptionEditor from '../components/DescriptionEditor';
import { API_BASE_URL } from '../utils/BaseUrl';
import '../stylesheets/ResumeShare.css';

function ResumeShare() {
    const { resumeId } = useParams();
    const location = useLocation();
    const [resumeData, setResumeData] = useState(null);
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState(null);
    const [showComments, setShowComments] = useState(true);

    // Get resume on component mount
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

    useEffect(() => {
        const fetchComments = async () => {
            try {

            }
            catch (error) {
                
            }
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/api/Comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({resumeId: resumeId, userId: "yuh", commentBody: comment, })
            });

            const data = await response.json();

            if (response.ok) {
                showToast("Comment added successfully", "success");
                setComment("");
            }
            else {
                showToast("Error adding comment.", "error");
            }
        }
        catch(error) {
            showToast("An error occurred.", "error");
            console.error(error);
        }
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: resumeData.resumeName == "Untitled Document" ? "My Resume" : resumeData.resumeName,
                    text: "Check out my resume on ResumePro!",
                    url: window.location.href
                })
                // .then(() => showToast("Article shared successfully!", "success"))
                .catch((error) => {
                    showToast("Error sharing article", "error");
                    console.error("Error sharing article:", error);
                })
        }
        else {
            showToast("Sharing is not supported on your browser. Please copy the URL manually.", "warning");
        }
    }

    if (!resumeData) return <div className="loading-spinner"></div>;

    return (
        <div className="page-ctnr ResumeShare">
            <div className="header-with-btn">
                <div className="page-header">
                    <h1>Share Resume</h1>
                    <p>Send your resume to others and allow them to leave comments.</p>
                </div>

                <div className="reanalyze-ctnr">
                    <button type="button" className="btn btn-outline btn-show" onClick={() => setShowComments(!showComments)}>
                    <img src="/assets/icons/document.svg" className="icon-dynamic" draggable="false" />
                    <span>{showComments ? "Hide" : "Show"} Comments</span>
                    </button>
                    <button type="button" className="btn btn-black" onClick={handleShare}>
                        <img src="/assets/icons/paper-plane.svg" draggable="false" />
                        <span>Share</span>
                    </button>
                </div>
            </div>
            <div className="side-by-side">
                {/* Resume view */}
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

                {/* Comments view */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div 
                            className="comments-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.6 }}
                        >
                            <form className="comments-form" onSubmit={(event) => handleSubmit(event)}>
                                <DescriptionEditor 
                                    value={""}
                                    placeholder={"Add comment..."}
                                    handleChange={(newVal) => setComment(newVal)}
                                    required
                                />
                                <button className="btn btn-blue">Submit</button>
                            </form>
                            <div className="comments-ctnr">
                                <div className="comments-header">
                                    <h3>Comments</h3>
                                    <div className="count">2</div>
                                </div>
                                <div className="comments-list">
                                    <div className="comment">
                                        <div className="comment-head">
                                            <img src="/assets/icons/user.svg" draggable="false" />
                                            <p className="name">Marven Mathelier</p>
                                            <p className="datetime">Mar 5, 2025 at 7:18pm</p>
                                        </div>
                                        <div className="comment-body">
                                            <p>This is an example comment.</p>
                                        </div>
                                    </div>
                                    <div className="comment">
                                        <div className="comment-head">
                                            <img src="/assets/icons/user.svg" draggable="false" />
                                            <p className="name">Thum Rangsiyawaranon</p>
                                            <p className="datetime">Mar 4, 2025 at 12:31pm</p>
                                        </div>
                                        <div className="comment-body">
                                            <p>Condensation happens when water vapor cools down and changes back into liquid droplets. It's the step before precipitation.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ResumeShare;