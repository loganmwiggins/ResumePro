import React from 'react';
import '../../stylesheets/Templates/Template_Minimal.css';

function Template_Minimal({ resumeData }) {

    const formatDate = (dateString, options = { month: true, day: true, year: true }) => {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day); // Month is zero-based
        
        // Determine the format based on the options provided
        const formatOptions = {
            ...(options.month && { month: "short" }),
            ...(options.day && { day: "numeric" }),
            ...(options.year && { year: "numeric" }),
        };
        
        return date.toLocaleDateString("en-US", formatOptions);
    };

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


            {/* PROJECTS */}
            {resumeData.projects.length > 0 && (
                <section>
                    <h2>PROJECTS</h2>
                    {resumeData.projects.map(proj => (
                        <div key={proj.title}>
                            <h3>{proj.title}</h3>
                            <p>
                                {proj.startDate && (
                                    `${formatDate(proj.startDate)}`
                                )} {proj.endDate && (
                                    `- ${formatDate(proj.endDate)}`
                                )}
                            </p>
                            <p>{proj.description}</p>
                        </div>
                    ))}
                </section>
            )}
            

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


            {/* EDUCATION */}
            {resumeData.educations.length > 0 && (
                <section>
                    <h2>EDUCATION</h2>
                    {resumeData.educations.map(edu => (
                        <div key={edu.startDate}>
                            <div className="entry-head">
                                <div>
                                    <h3>
                                        {edu.degreeType} {edu.major && (`in ${edu.major}`)}
                                    </h3>
                                    <h4>
                                        {edu.minor && (`Minor in ${edu.minor}`)}
                                    </h4>
                                    <p>
                                        {edu.schoolName} {edu.gpa && (
                                            `| GPA: ${edu.gpa} / 4.0`
                                        )}
                                    </p>
                                </div>
                                
                                <div>
                                    <p>
                                        {edu.startDate && (
                                            `${formatDate(edu.startDate, {month:true, year:true})}`
                                        )} {edu.endDate && (
                                            `- ${formatDate(edu.endDate, {month:true, year:true})}`
                                        )}
                                    </p>
                                    <p>
                                        {edu.schoolLocation && (
                                            `${edu.schoolLocation}`
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}

export default Template_Minimal;