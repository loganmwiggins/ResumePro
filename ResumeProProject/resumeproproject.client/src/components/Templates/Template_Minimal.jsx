import React from 'react';
import '../../stylesheets/Templates/Template_Minimal.css';

function Template_Minimal({ resumeData }) {
    // console.log(resumeData);
    return (
        <div className="resume-paper">
            <header>
                <div className="header-left">
                    <h1 className="text-3xl font-bold">
                        {resumeData.generalInformation.firstName} {resumeData.generalInformation.middleName} {resumeData.generalInformation.lastName}
                    </h1>
                    <p className="text-sm text-gray-600">{resumeData.generalInformation.email} | (123) 456-7890</p>
                </div>
                <div className="header-right">
                    <p>Deerfield Beach, FL</p>
                </div>
            </header>
            
            <section>
                <h2>EXPERIENCE</h2>
                <div className="experience">
                    <h3 className="font-semibold">Senior Software Engineer</h3>
                    <p>TechCorp | Aug 2020 - Present</p>
                    <div className="list-disc pl-5 text-sm text-gray-800">
                        <p>Developed scalable web apppcations using React and Node.js.</p>
                        <p>Led a team of 5 engineers to build enterprise-grade software.</p>
                        <p>Implemented performance optimizations, reducing load times by 30%.</p>
                    </div>
                </div>
            </section>

            <section>
                <h2>PROJECTS</h2>
                <div>
                    <h3>Open Source Dashboard</h3>
                    <p>November 2021</p>
                    <p>Developed a lightweight analytics dashboard with React and D3.js.</p>
                </div>
            </section>

            <section>
                <h2>CERTIFICATIONS</h2>
                <div>
                    <h3>Azure Developer Associate</h3>
                    <p>Microsoft | Issued: May 12, 2024 | Expires: May 12, 2026</p>
                </div>
                <div>
                    <h3>Azure Fundamentals</h3>
                    <p>Microsoft | Issued: March 31, 2024</p>
                </div>
            </section>
            
            <section>
                <h2>SKILLS</h2>
                <div className="list-disc pl-5 text-sm text-gray-800">
                    <div className="skill-row">
                        <h4>Frontend:</h4>
                        <p>React, TypeScript, JavaScript</p>
                    </div>
                    <div className="skill-row">
                        <h4>Backend:</h4>
                        <p>Node.js, Express, MongoDB, REST APIs, GraphQL</p>
                    </div>
                    <div className="skill-row">
                        <h4>Methodlogies:</h4>
                        <p>Agile Development, Code Reviews</p>
                    </div>
                </div>
            </section>

            <section>
                <h2>EDUCATION</h2>
                <div>
                    <h3 className="font-semibold">Bachelor of Science in Computer Science</h3>
                    <p>University of Example | 2016 - 2020</p>
                </div>
            </section>
        </div>
    );
}

export default Template_Minimal;