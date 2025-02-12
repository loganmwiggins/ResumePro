import React from 'react';
import '../../stylesheets/Templates/Template_Minimal.css';

function Template_Minimal({ resumeData }) {

    const officeTypeOptions = [
        { value: 0, label: "On-site" },
        { value: 1, label: "Remote" },
        { value: 2, label: "Hybrid" }
    ];

    const jobTypeOptions = [
        { value: 0, label: "Full-time" },
        { value: 1, label: "Part-time" },
        { value: 2, label: "Volunteer" },
        { value: 3, label: "Internship" }
    ];

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
                    <p>
                        {resumeData.generalInformation.role} {resumeData.generalInformation.role && resumeData.generalInformation.location && " | "} {resumeData.generalInformation.location}
                    </p>
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
            

            {/* EXPERIENCES */}
            {resumeData.experiences.length > 0 && (
                <section>
                    <h2>EXPERIENCE</h2>
                    {resumeData.experiences.map(exp => (
                        <div key={exp.description}>
                            <div className="entry-head">
                                <div>
                                    <h3>{exp.role}</h3>
                                    <p>
                                        {exp.companyName} {exp.jobType != null && (
                                            `| ${jobTypeOptions[exp.jobType].label}`
                                        )} {exp.officeType != null && (
                                            `| ${officeTypeOptions[exp.officeType].label}`
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        {exp.startDate && (
                                            `${formatDate(exp.startDate, {month:true, year:true})}`
                                        )} {exp.endDate && (
                                            `- ${formatDate(exp.endDate, {month:true, year:true})}`
                                        ) || "- Present"}
                                    </p>
                                    <p>{exp.location}</p>
                                </div>
                            </div>
                            <p dangerouslySetInnerHTML={{ __html: exp.description || "Error rendering rich text." }}></p>
                        </div>
                    ))}
                </section>
            )}


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
            
            
            {/* SKILLS */}
            {resumeData.skills?.skillsDataJson && Object.keys(resumeData.skills.skillsDataJson).length > 0 && (
                <section>
                    <h2>SKILLS</h2>
                    <div>
                        {Object.entries(resumeData.skills.skillsDataJson).map(([category, skillsObj]) => (
                            <div className="skill-row" key={category}>
                                <h4>{category}:</h4>
                                <p>{Array.from(skillsObj).join(", ")}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}


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