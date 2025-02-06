import React from 'react';
import '../../stylesheets/Templates/Template_Minimal.css';

function Template_Minimal({ resumeData }) {
    // console.log(resumeData);

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day); // Month is zero-based in JavaScript Date()
        
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    return (
        <div className="resume-paper">
            {/* GENERAL INFORMATION */}
            <header>
                <div className="header-left">
                    <h1>{resumeData.generalInformation.firstName} {resumeData.generalInformation.middleName} {resumeData.generalInformation.lastName}</h1>
                    <p>{resumeData.generalInformation.location}</p>
                </div>
                <div className="header-right">
                    <p>{resumeData.generalInformation.email}</p>
                    <p>{resumeData.generalInformation.phoneNumber}</p>
                </div>
            </header>

            {/* URLS */}
            <section>
                <div className="urls">
                    {resumeData.generalInformation.websiteUrl && (
                        <span>
                            <img src="/assets/icons/web-circle.svg" draggable="false" />
                            <p>{resumeData.generalInformation.websiteUrl}</p>
                        </span>
                    )}
                    {resumeData.generalInformation.linkedInUrl && (
                        <span>
                            <img src="/assets/icons/linkedin-circle.svg" draggable="false" />
                            <p>{resumeData.generalInformation.linkedInUrl}</p>
                        </span>
                    )}
                    {resumeData.generalInformation.gitHubUrl && (
                        <span>
                            <img src="/assets/icons/github-circle.svg" draggable="false" />
                            <p>{resumeData.generalInformation.gitHubUrl}</p>
                        </span>
                    )}
                </div>
            </section>
            
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

            {/* CERTIFICATIONS */}
            {resumeData.certifications.length > 0 && (
                <section>
                    <h2>CERTIFICATIONS</h2>
                    {resumeData.certifications.map(cert => (
                        <div key={cert.name}>
                            <h3>{cert.name}</h3>
                            <p>
                                {cert.issuer} {cert.issueDate && (
                                    `| Issued: ${formatDate(cert.issueDate)}` 
                                )} {cert.expireDate && (
                                    `| Expires: ${formatDate(cert.expireDate)}`
                                )}
                            </p>
                        </div>
                    ))}
                </section>
            )}
            
            
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