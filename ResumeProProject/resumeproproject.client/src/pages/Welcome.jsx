import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/Welcome.css';
import AuthorizeView from '../components/AuthorizeView';

function Welcome() {
    const navigate = useNavigate();

    return (
    <AuthorizeView> 
        <div className="welcome-container">
            <div className="welcome-content">
                <div className="page-header">
                    <h1>Welcome</h1>
                </div>

                <h3>Your Path to a Standout Resume!</h3>
                <p>
                    Creating a professional resume has never been easier! ResumePro is your all-in-one resume builder, designed to help you craft an eye-catching, industry-ready resume in minutes. Whether you’re a seasoned professional or just starting your career journey, our guided input system makes it simple to showcase your skills, experience, and personality.
                </p>

                <h3>Why ResumePro?</h3>
                <div className="list-item">
                    <div className="bullet"></div>
                    <div className="list-item-txt">
                        <p>Choose from Stunning Templates</p>
                        <p>Select from multiple expertly designed resume templates to match your style and industry.</p>
                    </div>
                </div>
                <div className="list-item">
                    <div className="bullet"></div>
                    <div className="list-item-txt">
                        <p>Easy & Intuitive Input</p>
                        <p>Our step-by-step guided interface ensures you include all the right details.</p>
                    </div>
                </div>
                <div className="list-item">
                    <div className="bullet"></div>
                    <div className="list-item-txt">
                        <p>Save & Export Seamlessly</p>
                        <p>Save your resume to your profile and export it as a PDF (and soon, Word!).</p>
                    </div>
                </div>
                <div className="list-item">
                    <div className="bullet"></div>
                    <div className="list-item-txt">
                        <p>More Features Coming Soon!</p>
                        <p>AI-powered suggestions, live previews, and more templates tailored to your field.</p>
                    </div>
                </div>
                
                <p>Take the first step toward landing your dream job. Let’s build your perfect resume! 🚀</p>

                <button
                    onClick={() => navigate("/templates")}
                    className="btn-accent"
                >
                    <img src="assets/icons/new-document.svg" draggable="false" />
                    Get Started
                </button>
            </div>

            <div className="welcome-content">
                <div className="document"></div>
            </div>
        </div>
    </AuthorizeView> 
    )
}

export default Welcome;