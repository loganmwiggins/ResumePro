import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import '../stylesheets/Welcome.css';

function Welcome() {
    const navigate = useNavigate();

    const handleStart = () => navigate("/home"); 

    return (
        <div className="welcome-container">
            {/* Header */}
            <motion.div 
                className="welcome-header-ctnr"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0 }}
            >
                <img src="/assets/images/blue-grad-2.jpg" draggable="false" />
                <div className="welcome-header">
                    <div className="section-header">
                        <p>Welcome</p>
                        <h1>Your Path to a Standout Resume</h1>
                    </div>
                    <p>
                        Creating a professional resume has never been easier! ResumePro is your all-in-one resume builder, designed to help you craft an eye-catching, industry-ready resume in minutes.
                    </p>
                    <button 
                        className="btn btn-black"
                        onClick={handleStart}
                    >
                        Get Started
                    </button>
                </div>
            </motion.div>

            {/* Our Mission */}
            <motion.div 
                className="section-ctnr"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <div className="section-header">
                    <p>Our Mission</p>
                    <h1>Why ResumePro?</h1>
                </div>
                <div className="card-ctnr">
                    <div className="card">
                        <img src="/assets/icons/welcome/artwork.svg" draggable="false" />
                        <h3>Stunning Templates</h3>
                        <p>Select from multiple resume templates to match your style and industry.</p>
                    </div>
                    <div className="card">
                        <img src="/assets/icons/welcome/intuitive.svg" draggable="false" />
                        <h3>Easy & Intuitive Input</h3>
                        <p>Our step-by-step guided interface ensures you include all the right details.</p>
                    </div>
                    <div className="card">
                        <img src="/assets/icons/welcome/case-study.svg" draggable="false" />
                        <h3>Export Seamlessly</h3>
                        <p>Save your resume to your profile and export it as a PDF (and soon, Word!).</p>
                    </div>
                    <div className="card">
                        <img src="/assets/icons/welcome/ai.svg" draggable="false" />
                        <h3>AI Integration</h3>
                        <p>Use Artificial Intelligence to help you revise and improve your resumes.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Welcome;