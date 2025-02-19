import React from 'react';
import DOMPurify from 'dompurify';

import { formatDate } from '../../utils/DateFormatter';
import { officeTypeOptions, jobTypeOptions } from '../../utils/SelectOptions';
import '../../stylesheets/Templates/Template_Minimal.css';

function Template_Minimal({ data }) {
    return (
        <div className="resume-paper Template_Minimal">
            {/* GENERAL INFORMATION */}
            <header>
                <div className="header-left">
                    <h1>{data.generalInformation.firstName} {data.generalInformation.middleName} {data.generalInformation.lastName}</h1>
                    <p>
                        {data.generalInformation.role} {data.generalInformation.role && data.generalInformation.location && " | "} {data.generalInformation.location}
                    </p>
                </div>
                <div className="header-right">
                    <p>{data.generalInformation.email}</p>
                    <p>{data.generalInformation.phoneNumber}</p>
                </div>
            </header>


            {/* URLS */}
            <section>
                <div className="urls">
                    {data.generalInformation.websiteUrl && (
                        <span>
                            <img src="/assets/icons/web-circle.svg" draggable="false" />
                            <p>{data.generalInformation.websiteUrl}</p>
                        </span>
                    )}
                    {data.generalInformation.linkedInUrl && (
                        <span>
                            <img src="/assets/icons/linkedin-circle.svg" draggable="false" />
                            <p>{data.generalInformation.linkedInUrl}</p>
                        </span>
                    )}
                    {data.generalInformation.gitHubUrl && (
                        <span>
                            <img src="/assets/icons/github-circle.svg" draggable="false" />
                            <p>{data.generalInformation.gitHubUrl}</p>
                        </span>
                    )}
                </div>
            </section>
            

            {/* EXPERIENCES */}
            {data.experiences.length > 0 && (
                <section>
                    <h2>EXPERIENCE</h2>
                    {data.experiences.map(exp => {
                        let sanitizedDescription = DOMPurify.sanitize(exp.description || "", {
                            ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                        });

                        return(
                            <div key={exp.description}>
                                <div className="entry-head">
                                    <div>
                                        <p className="p-main">{exp.role}</p>
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
                                <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
                            </div>
                        );
                    })}
                </section>
            )}


            {/* PROJECTS */}
            {data.projects.length > 0 && (
                <section>
                    <h2>PROJECTS</h2>
                    {data.projects.map(proj => {
                        let sanitizedDescription = DOMPurify.sanitize(proj.description || "", {
                            ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                        });

                        return(
                            <div key={proj.title}>
                                <div className="entry-head">
                                    <div>
                                        <p className="p-main">{proj.title}</p>
                                    </div>
                                    <div>
                                        <p>
                                            {proj.startDate && (
                                                `${formatDate(proj.startDate, {month: true, year: true})}`
                                            )} {proj.endDate && (
                                                `- ${formatDate(proj.endDate, {month: true, year: true})}`
                                            )}
                                        </p>
                                    </div>
                                </div>
                                
                                <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
                            </div>
                        );
                    })}
                </section>
            )}
            

            {/* CERTIFICATIONS */}
            {data.certifications.length > 0 && (
                <section>
                    <h2>CERTIFICATIONS</h2>
                    {data.certifications.map(cert => (
                        <div key={cert.name}>
                            <p>
                                <span className="p-main">
                                    {cert.issuer} {cert.name}
                                </span>
                                <span>
                                    {cert.issueDate && cert.expireDate
                                        ? ` | ${formatDate(cert.issueDate, { month: true, year: true })} - ${formatDate(cert.expireDate, { month: true, year: true })}`
                                        : cert.issueDate
                                            ? ` | Issued: ${formatDate(cert.issueDate, { month: true, year: true })}`
                                            : cert.expireDate
                                                ? ` | Expires: ${formatDate(cert.expireDate, { month: true, year: true })}`
                                                : ""}
                                </span>
                            </p>
                        </div>
                    ))}
                </section>
            )}
            
            
            {/* SKILLS */}
            {data.skills?.skillsDataJson && Object.keys(data.skills.skillsDataJson).length > 0 && (
                <section>
                    <h2>SKILLS</h2>
                    <div>
                        {Object.entries(data.skills.skillsDataJson).map(([category, skillsObj]) => (
                            <div className="skill-row" key={category}>
                                <p><b>{category}:</b> {Array.from(skillsObj).join(", ")}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}


            {/* EDUCATION */}
            {data.educations.length > 0 && (
                <section>
                    <h2>EDUCATION</h2>
                    {data.educations.map(edu => (
                        <div key={edu.startDate}>
                            <div className="entry-head">
                                <div>
                                    <p className="p-main">
                                        {edu.degreeType} {edu.major && (`in ${edu.major}`)}
                                    </p>
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