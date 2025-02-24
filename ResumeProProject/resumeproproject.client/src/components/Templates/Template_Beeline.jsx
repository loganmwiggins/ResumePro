import React from 'react';
import DOMPurify from 'dompurify';

import { formatDate } from '../../utils/DateFormatter';
import { officeTypeOptions, jobTypeOptions } from '../../utils/SelectOptions';
import '../../stylesheets/templates/Template_Beeline.css';

function Template_Beeline({ data }) {
    return (
        <div className="resume-paper Template_Beeline">
            {/* GENERAL INFORMATION */}
            <header className="header">
                <div className="title-text">
                    <h1>{data.generalInformation.firstName} {data.generalInformation.middleName} {data.generalInformation.lastName}</h1>
                    <div>
                        {data.generalInformation.role && (
                           <p>{data.generalInformation.role}</p> 
                        )}
                        {data.generalInformation.location && (
                           <p>{data.generalInformation.location}</p> 
                        )}
                    </div>
                </div>
                {(data.generalInformation.email || data.generalInformation.phoneNumber) && (
                    <div className="contact-line">
                        {data.generalInformation.email && (
                            <p>{data.generalInformation.email}</p>
                        )}
                        {data.generalInformation.phoneNumber && (
                            <p>{data.generalInformation.phoneNumber}</p>
                        )}
                    </div>
                )}
                
                {(data.generalInformation.websiteUrl || data.generalInformation.linkedInUrl || data.generalInformation.gitHubUrl) && (
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
                )}
            </header>

            {/* EXPERIENCE */}
            {data.experiences.length > 0 && (
                <section>
                    <div className="section-label">
                        <p>Experience</p>
                    </div>
                    <div className="section-content">
                        {data.experiences.map((exp, index) => {
                            let sanitizedDescription = DOMPurify.sanitize(exp.description || "", {
                                ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                            });

                            return(
                                <div key={index} className="entry-ctnr">
                                    <p className="text-sub">
                                        {(exp.startDate || exp.endDate) && (
                                            <span>
                                                {exp.startDate && (
                                                    `${formatDate(exp.startDate, {month:true, year:true})}`
                                                )} {exp.endDate && (
                                                    `- ${formatDate(exp.endDate, {month:true, year:true})}`
                                                ) || "- Present"}
                                            </span>
                                        )}
                                        
                                        {exp.jobType != null && (
                                            <span> • {jobTypeOptions[exp.jobType].label}</span>
                                        )} 
                                        {exp.officeType != null && (
                                            <span> • {officeTypeOptions[exp.officeType].label}</span>
                                        )}
                                    </p>

                                    <p>
                                        <span className="text-main">{exp.role}</span>

                                        {exp.companyName && (
                                            <span> | {exp.companyName}</span>
                                        )}

                                        {exp.location && (
                                            <span> | {exp.location}</span>
                                        )}
                                    </p>

                                    {sanitizedDescription && (
                                        <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}


            {/* PROJECTS */}
            {data.projects.length > 0 && (
                <section>
                    <div className="section-label">
                        <p>Projects</p>
                    </div>
                    <div className="section-content">
                        {data.projects.map((proj, index) => {
                            let sanitizedDescription = DOMPurify.sanitize(proj.description || "", {
                                ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                            });

                            return (
                                <div key={index} className="entry-ctnr">
                                    <p className="text-sub">
                                        {proj.startDate && (
                                            `${formatDate(proj.startDate, {month:true, year:true})}`
                                        )} {proj.endDate && (
                                            `- ${formatDate(proj.endDate, {month:true, year:true})}`
                                        )}
                                    </p>
                                    <p className="text-main">
                                        {proj.title}
                                    </p>

                                    {sanitizedDescription && (
                                        <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}


            {/* CERTIFICATIONS */}
            {data.certifications.length > 0 && (
                <section>
                    <div className="section-label">
                        <p>Certifications</p>
                    </div>
                    <div className="section-content">
                        {data.certifications.map((cert, index) => (
                            <div key={index} className="entry-ctnr">
                                <p className="text-sub">
                                    {cert.issueDate && cert.expireDate
                                        ? `${formatDate(cert.issueDate, { month: true, year: true })} - ${formatDate(cert.expireDate, { month: true, year: true })}`
                                        : cert.issueDate
                                            ? `Issued: ${formatDate(cert.issueDate, { month: true, year: true })}`
                                            : cert.expireDate
                                                ? `Expires: ${formatDate(cert.expireDate, { month: true, year: true })}`
                                                : ""}
                                </p>
                                <p>
                                    <span className="text-main">{cert.name}</span> 
                                    {cert.issuer && (
                                        <span>{` | ${cert.issuer}`}</span>
                                    )}
                                    
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}


            {/* SKILLS */}
            {data.skills?.skillsDataJson && Object.keys(data.skills.skillsDataJson).length > 0 && (
                <section>
                    <div className="section-label">
                        <p>Skills</p>
                    </div>
                    <div className="section-content">
                        <div className="skills-list">
                            {Object.entries(data.skills.skillsDataJson).map(([category, skillsObj]) => (
                                <p key={category}>
                                    <span className="text-main">{category}:</span> <span>{Array.from(skillsObj).join(", ")}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* EDUCATION */}
            {data.educations.length > 0 && (
                <section>
                    <div className="section-label">
                        <p>Education</p>
                    </div>
                    <div className="section-content">
                        {data.educations.map((edu, index) => (
                            <div key={index} className="entry-ctnr">
                                <p className="text-sub">
                                    {edu.startDate && (
                                        `${formatDate(edu.startDate, {month:true, year:true})}`
                                    )} {edu.endDate && (
                                        `- ${formatDate(edu.endDate, {month:true, year:true})}`
                                    )}
                                </p>
                                <p>
                                    {edu.degreeType && (
                                        <span className="text-main">{edu.degreeType}:</span>
                                    )} <span>{edu.major}</span>
                                </p>
                                
                                {edu.minor && (
                                    <p>
                                        <span className="text-main">Minor:</span> <span>{edu.minor}</span>
                                        {edu.gpa && (
                                            <span> | GPA: {edu.gpa} / 4.0</span>
                                        )}
                                    </p>
                                )}
                                
                                <p>
                                    <span>{edu.schoolName}</span> 
                                    {edu.schoolLocation && (
                                        <span> | {edu.schoolLocation}</span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Template_Beeline;