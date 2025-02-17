import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import '../stylesheets/Help.css';

function Help({ setShowWalkthrough }) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Welcome to ResumePro",
            description: "Let's get you started by teaching you a little bit about the app.",
        },
        {
            title: "Check out the Home page",
            description: "The Home page is where you can access all of your created resumes. This is also where you will create new resumes.",
        },
        {
            title: "Check out your Profile",
            description: `The Profile page contains your user information. 
                          You can edit information pertaining to your account, such as your username, password, and profile picture. 
                          Access your profile page by clicking the user dropdown in the top right of the navigation bar.`,
        },
        {
            title: "Setting a Default Resume",
            description: `One of the many useful features in ResumePro is the ability to set a default resume. 
                          When you set a resume as the default, whenever you create a new resume, it will pre-populate with that information.`,
        }
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
                <div className="step-ctnr">
                    <h2>{steps[currentStep].title}</h2>
                    <p>{steps[currentStep].description}</p>
                    <div className="img-ctnr">
                        x
                    </div>
                </div>

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