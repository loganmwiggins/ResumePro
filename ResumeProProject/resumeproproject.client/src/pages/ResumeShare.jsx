import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { showToast } from '../utils/Toast';
import { confirmAlert } from 'react-confirm-alert';
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
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [userIsOwner, setUserIsOwner] = useState(false);

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

    // Fetch existing comments list
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

    // Logic to check if current user owns document
    useEffect(() => {
        if (user && resumeData) {
            if (resumeData.userId === user.id) {
                setUserIsOwner(true);
            }
            else setUserIsOwner(false);
        }
    }, [resumeData, user]);

    // Logic for disclaimer pop-up
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".info-item")) {
                setShowDisclaimer(false);
            }
        }
    
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment || comment === "") {
            showToast("Comments cannot be empty", "warning");
            return;
        }

        try {
            let fullName = null;
            let userId = null;
            let profileImage = null;

            if (user) {
                console.log(user);
                fullName = `${user.firstName} ${user.lastName}`;
                userId = user.id;
                profileImage = user.profileImage;
            }

            const response = await fetch(`${API_BASE_URL}/api/Comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resumeId: resumeId, 
                    userId: userId, 
                    fullName: fullName,
                    userImage: profileImage,
                    commentBody: comment, 
                    dateTimeSubmitted: new Date() 
                })
            });

            if (response.ok) {
                showToast("Comment added successfully", "success");
                setComment("");

                const data = await response.json();

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

    // Helper function to confirm and delete insight
    const confirmDelete = (commentId) => {
        confirmAlert({
            customUI: ({ onClose }) => {
            return (
                <div className="custom-alert">
                    <div className="alert-header">
                        <h3>Are you sure you want to delete this comment?</h3>
                        <p>This action cannot be undone. This comment will be permanently deleted and will no longer be visible to others.</p>
                    </div>
                    
                    <div className="alert-btns">
                        <button 
                            className="btn btn-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-blue"
                            onClick={() => {
                                deleteComment(commentId);
                                onClose();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            );
            }
        });
    }

    const deleteComment = async (commentId) => {
        // Optimistically remove the comment
        const previousComments = [...commentList]; // Store current state in case of rollback
        const updatedComments = commentList.filter(comment => comment.commentId !== commentId);
        setCommentList(updatedComments); // Update UI before API call
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/Comment/${commentId}`, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete comment.");
            }
    
            showToast("Comment removed successfully", "success");
        } catch (error) {
            showToast("Error deleting comment", "error");
            setCommentList(previousComments); // Rollback state if API call fails
        }
    };
    

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: resumeData.resumeName == "Untitled Document" ? "My Resume" : resumeData.resumeName,
                    text: "Check out my resume on ResumePro!",
                    url: window.location.href
                })
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
            {userIsOwner && (
                <div className="header-with-btn">
                    <div className="page-header">
                        <h1>Share Resume</h1>
                        <p>Send your resume and receive feedback from others.</p>
                    </div>

                    <div className="reanalyze-ctnr">
                        <button type="button" className="btn btn-black" onClick={handleShare}>
                            <img src="/assets/icons/paper-plane.svg" draggable="false" />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            )}
            
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
                    {!commentsLoading ? (
                        <motion.div 
                            className="comments-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Document information */}
                            <div className="doc-info-ctnr">
                                <div title="Resume Title">
                                    <img src="/assets/icons/document.svg" className="icon-dynamic" draggable="false" />
                                    <p>"{resumeData.resumeName}"</p>
                                </div>
                                <div title="Resume For">
                                    <img src="/assets/icons/user-2.svg" className="icon-dynamic" draggable="false" />
                                    <p>{resumeData.generalInformation.firstName} {resumeData.generalInformation.lastName}</p>
                                </div>
                                <div title="Last Updated">
                                    <img src="/assets/icons/pencil.svg" className="icon-dynamic" draggable="false" />
                                    <p>{formatDateTime(resumeData.updatedDateTime)}</p>
                                </div>
                            </div>
                            {/* Comment form */}
                            <form className="comments-form" onSubmit={(event) => handleSubmit(event)}>
                                <DescriptionEditor 
                                    value={comment}
                                    placeholder={"Add comment..."}
                                    handleChange={(newVal) => setComment(newVal)}
                                    required
                                />
                                <div className="form-btns">
                                    <button className="btn btn-blue">Submit</button>
                                    <div className="info-item">
                                        <img 
                                            src="/assets/icons/info.svg" 
                                            draggable="false" 
                                            className="icon-dynamic info-icon"
                                            onClick={() => setShowDisclaimer(!showDisclaimer)}
                                        />
                                        <AnimatePresence>
                                            {showDisclaimer && (
                                            <motion.div
                                                className="info-txt"
                                                initial={{ opacity: 0, y: -10}}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                            >
                                                <span>
                                                    Please be respectful when leaving comments. Constructive feedback is encouraged, but inappropriate or offensive remarks will not be tolerated.
                                                </span>
                                                <br /><br />
                                                <span>Comments cannot be edited after submission — they can only be deleted.</span>
                                                <br /><br />
                                                <span>If you are not logged in, your comment will be posted anonymously and cannot be edited or deleted.</span>
                                            </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </form>

                            {/* Comments list */}
                            {commentList && (
                                <div className="comments-ctnr">
                                    <div className="comments-header">
                                        <h3>Comments</h3>
                                        <div className="count">{commentList.length}</div>
                                        <button
                                            type="button"
                                            className="btn btn-icon"
                                            onClick={() => setShowComments(!showComments)}
                                        >
                                            <motion.img
                                                src="/assets/icons/angle-down.svg"
                                                className="icon-dynamic angle-icon"
                                                draggable="false"
                                                animate={{ rotate: showComments ? 180 : 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            />
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {showComments && (
                                            <div className="comments-list">
                                                {commentList.length > 0 ? (
                                                    commentList.map((comment, index) => {
                                                        let sanitizedBody = DOMPurify.sanitize(comment.commentBody || "", {
                                                            ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                                                        });

                                                        return (
                                                            <motion.div 
                                                                key={index}
                                                                className="comment"
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                transition={{ duration: 0.6, delay: `${index * 0.1}` }}
                                                            >
                                                                <div className="comment-content">
                                                                    <div className="comment-head">
                                                                        <div className="pfp">
                                                                            {comment.userImage ? (
                                                                                <img src={comment.userImage} draggable="false" />
                                                                            ) : (
                                                                                <img src="/assets/icons/user.svg" draggable="false" />
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <div className="head-text">
                                                                            <div className="head-main">
                                                                                <p className="name">
                                                                                    {comment.fullName ? comment.fullName : "Anonymous"}
                                                                                </p>
                                                                                {comment.userId === resumeData.userId && (
                                                                                    <p className="owner-tag">Owner</p>
                                                                                )}
                                                                            </div>
                                                                            <div className="head-sub">
                                                                                <p className="datetime">{formatDateTime(comment.dateTimeSubmitted)}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="comment-body">
                                                                        {sanitizedBody && (
                                                                            <p dangerouslySetInnerHTML={{ __html: sanitizedBody }}></p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {(user && (userIsOwner || comment.userId === user.id)) && (
                                                                    <div className="comment-actions">
                                                                        <button 
                                                                            type="button" 
                                                                            className="btn btn-icon" 
                                                                            onClick={() => confirmDelete(comment.commentId)}
                                                                        >
                                                                            <img src="/assets/icons/trash.svg" className="icon-dynamic" draggable="false" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="no-comment">
                                                        <p>No comments yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="loading-spinner"></div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ResumeShare;