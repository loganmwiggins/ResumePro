import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/Welcome.css';

function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <div className="welcome-header-ctnr">
                <img src="/assets/images/blue-grad-2.jpg" draggable="false" />
                <div className="welcome-header">
                    <div className="section-header">
                        <p>Welcome</p>
                        <h1>Your Path to a Standout Resume</h1>
                    </div>
                    <p>
                        Creating a professional resume has never been easier! ResumePro is your all-in-one resume builder, designed to help you craft an eye-catching, industry-ready resume in minutes.
                    </p>
                    <button className="btn btn-black">Get Started</button>
                </div>
            </div>
            <div className="section-ctnr">
                <div className="section-header">
                    <p>Our Mission</p>
                    <h1>Why ResumePro?</h1>
                </div>
                <div className="card-ctnr">
                    <div className="card">
                        <img src="/assets/icons/Home/pack-1/artwork.svg" draggable="false" />
                        <h3>Stunning Templates</h3>
                        <p>Select from multiple expertly designed resume templates to match your style and industry.</p>
                    </div>
                    <div className="card">
                        <img src="/assets/icons/Home/pack-1/intuitive.svg" draggable="false" />
                        <h3>Easy & Intuitive Input</h3>
                        <p>Our step-by-step guided interface ensures you include all the right details.</p>
                    </div>
                    <div className="card">
                        <img src="/assets/icons/Home/pack-1/case-study.svg" draggable="false" />
                        <h3>Export Seamlessly</h3>
                        <p>Save your resume to your profile and export it as a PDF (and soon, Word!).</p>
                    </div>
                    <div className="card">
                        <img src="/assets/icons/Home/pack-1/ai.svg" draggable="false" />
                        <h3>AI Integration</h3>
                        <p>Use Artificial Intelligence to help you revise and improve your resumes.</p>
                    </div>
                </div>
            </div>
            
            




            {/* <div className="welcome-content">
                <div className="page-header">
                    <h1>Welcome</h1>
                </div>

                <h3>Your Path to a Standout Resume</h3>
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
                    className="btn btn-accent"
                >
                    <img src="assets/icons/new-document.svg" draggable="false" />
                    <span>Get Started</span>
                </button>
            </div>

            <div className="welcome-content">
                <div className="document"></div>
            </div> */}
        </div>
    )
}

export default Welcome;