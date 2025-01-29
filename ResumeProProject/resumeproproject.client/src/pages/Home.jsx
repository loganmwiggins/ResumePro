import '../stylesheets/Home.css';

import React from 'react'

function Home() {
  return (
    <>
        <div className="page-header">
            <h1>Welcome</h1>
        </div>

        <div className="home-content">
            <p>Your Path to a Standout Resume!</p>
            <p>
                Creating a professional resume has never been easier! ResumePro is your all-in-one resume builder, designed to help you craft an eye-catching, industry-ready resume in minutes. Whether you’re a seasoned professional or just starting your career journey, our guided input system makes it simple to showcase your skills, experience, and personality.
            </p>

            <h3>Why ResumePro?</h3>
            <p>✅ Choose from Stunning Templates – Select from multiple expertly designed resume templates to match your style and industry.</p>
            <p>✅ Easy & Intuitive Input – Our step-by-step guided interface ensures you include all the right details.</p>
            <p>✅ Save & Export Seamlessly – Save your resume to your profile and export it as a PDF (and soon, Word!).</p>
            <p>✅ More Features Coming Soon! – AI-powered suggestions, live previews, and more templates tailored to your field.</p>
            <p>Take the first step toward landing your dream job. Let’s build your perfect resume! 🚀</p>
            <button>Get Started</button>
        </div>
    </>
  )
}

export default Home;