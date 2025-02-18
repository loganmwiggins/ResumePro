import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import '../stylesheets/Help.css';

function Help({ setShowWalkthrough }) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Welcome to ResumePro!",
            description: "Let’s take a quick tour of ResumePro to help you get started and make the most of its features.",
            imgPath: ""
        },
        {
            title: "Manage Resumes on the Home Page",
            description: "The Home page is your hub for all things resumes. Create, edit, and manage your existing resumes with ease.",
            imgPath: ""
        },
        {
            title: "Customize Your Profile",
            description: `Your Profile page stores all your personal information. 
                          Here, you can update your username, password, and profile picture. 
                          Access it anytime via the user dropdown in the top-right corner.`,
            imgPath: ""
        },
        {
            title: "Set a Default Resume",
            description: `Speed up your workflow by setting a default resume. 
                          This ensures new resumes start with your preferred template and details pre-filled.`,
            imgPath: ""
        },
        {
            title: "You're All Set!",
            description: "That’s it! Now you’re ready to start building and managing your resumes like a pro.",
            imgPath: ""
        },
    ];    

    const handleContinue = () => {
        if (currentStep < steps.length - 1) 
            setCurrentStep(prevStep => prevStep + 1);
    }

    const handleBack = () => {
        if (currentStep > 0)
            setCurrentStep(prevStep => prevStep - 1);
    }

    const handleDone = () => {
        navigate("/home");
    }

    return (
        <div className="page-ctnr-center WalkthroughMenu">
            <div className="help-modal">
                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        className="step-ctnr"
                        key={currentStep}
                        initial={{ opacity: 0, x: 50}}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <div className="step-header">
                            <h2>{steps[currentStep].title}</h2>
                            <p>{steps[currentStep].description}</p>
                        </div>
                        
                        <div className="img-ctnr">
                            Add image
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Actions */}
                <div className="walkthrough-actions">
                    <div className="page-dot-ctnr">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`page-dot ${index === currentStep ? 'active' : ''}`}
                            >
                            </div>
                        ))}
                    </div>
                    
                    <div className="btn-row">
                        <motion.button
                            type="button" 
                            className={`btn btn-black ${currentStep === 0 ? 'btn-disabled' : ''}`}
                            onClick={handleBack}
                            whileTap={{scale: 0.9}}
                        >
                            Back
                        </motion.button>
                        {currentStep === steps.length - 1 ? 
                            (
                                <motion.button 
                                    type="button" 
                                    className="btn btn-success"
                                    onClick={handleDone}
                                    whileTap={{scale: 0.9}}
                                >
                                    <span>Done</span>
                                    <img src="/assets/icons/check.svg" draggable="false" />
                                </motion.button>
                            ) : (
                                <motion.button 
                                    type="button" 
                                    className="btn btn-blue"
                                    onClick={handleContinue}
                                    whileTap={{scale: 0.9}}
                                >
                                    <span>Continue</span>
                                </motion.button>
                            )
                        }
                    </div>
                    <div className="btn-row">
                        <motion.button 
                            type="button" 
                            className="btn btn-outline"
                            onClick={handleDone}
                            whileTap={{scale: 0.9}}
                        >
                            Skip Walkthrough
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Help;