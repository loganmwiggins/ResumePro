import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { showToast } from '../utils/Toast';
import DOMPurify from 'dompurify';

import AllTemplates from '../components/templates/AllTemplates';
import DescriptionEditor from '../components/DescriptionEditor';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../utils/BaseUrl';
import { formatDateTime } from '../utils/DateFormatter';
import '../stylesheets/ResumeShare.css';

function ResumeShare() {
    const { resumeId } = useParams();
    const location = useLocation();
    const { user, userLoading } = useUser();

    const [resumeData, setResumeData] = useState(null);
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(false);
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
            setCommentsLoading(true);

            try {
                const response = await fetch(`${API_BASE_URL}/api/Comment/${resumeId}`);

                if (!response.ok) {
                    showToast("Error fetching comments", "error");
                }
                
                const data = await response.json();

                if (!data || data.length === 0) {
                    setCommentList([]);
                    return;
                }
                else setCommentList(data);
            }
            catch (error) {
                console.error("(catch) Error fetching comments:", error);
                showToast("An error occurred.", "error");
            }
            finally {
                setCommentsLoading(false);
            }
        }

        fetchComments();
    }, [resumeId, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let fullName = null;
            let userId = null;

            if (user) {
                fullName = `${user.firstName} ${user.lastName}`;
                userId = user.id;
            }

            const response = await fetch(`${API_BASE_URL}/api/Comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({resumeId: resumeId, userId: userId, fullName: fullName, commentBody: comment, dateTimeSubmitted: new Date() })
            });

            if (response.ok) {
                showToast("Comment added successfully", "success");
                setComment("");

                const data = await response.json();
                console.log(data);

                // Add new comment to state (optimistic update)
                setCommentList((prevComments) => [data.comment, ...(prevComments || [])]);
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
                    <img src="/assets/icons/messages.svg" className="icon-dynamic" draggable="false" />
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
                        !commentsLoading ? (
                            <motion.div 
                                className="comments-view"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.6 }}
                            >
                                <form className="comments-form" onSubmit={(event) => handleSubmit(event)}>
                                    <DescriptionEditor 
                                        value={comment}
                                        placeholder={"Add comment..."}
                                        handleChange={(newVal) => setComment(newVal)}
                                        required
                                    />
                                    <button className="btn btn-blue">Submit</button>
                                </form>

                                {/* Comments list */}
                                {commentList && (
                                    <div className="comments-ctnr">
                                        <div className="comments-header">
                                            <h3>Comments</h3>
                                            <div className="count">{commentList.length}</div>
                                        </div>
                                        <div className="comments-list">
                                            {commentList.length > 0 ? (
                                                commentList.map((comment, index) => {
                                                    let sanitizedBody = DOMPurify.sanitize(comment.commentBody || "", {
                                                        ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                                                    });

                                                    return (
                                                        <AnimatePresence>
                                                            <motion.div 
                                                                key={index}
                                                                className="comment"
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.6, delay: `${index * 0.1}` }}
                                                            >
                                                                <div className="comment-head">
                                                                    <img src="/assets/icons/user.svg" draggable="false" />
                                                                    <p className="name">
                                                                        {comment.fullName ? comment.fullName : "Anonymous"}
                                                                    </p>
                                                                    <p className="datetime">{formatDateTime(comment.dateTimeSubmitted)}</p>
                                                                </div>
                                                                <div className="comment-body">
                                                                    {sanitizedBody && (
                                                                        <p dangerouslySetInnerHTML={{ __html: sanitizedBody }}></p>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    );
                                                })
                                            ) : (
                                                <p>No comments yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="loading-spinner"></div>
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ResumeShare;