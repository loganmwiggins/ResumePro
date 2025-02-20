import React from 'react';
import DOMPurify from 'dompurify';

import { formatDate } from '../../utils/DateFormatter';
import { officeTypeOptions, jobTypeOptions } from '../../utils/SelectOptions';
import '../../stylesheets/Templates/Template_Beeline.css';
import { div, p, span } from 'framer-motion/client';

function Template_Beeline({ data }) {
    return (
        <div className="resume-paper Template_Beeline">
            {/* GENERAL INFORMATION */}
            <header className="header">
                <div className="title-text">
                    <h1>{data.generalInformation.firstName} {data.generalInformation.middleName} {data.generalInformation.lastName}</h1>
                    <div>
                        <p>
                            {data.generalInformation.role && (data.generalInformation.role)}
                        </p>
                        <p>
                            {data.generalInformation.location && (data.generalInformation.location)}
                        </p>
                    </div>
                </div>
                <div className="contact-line">
                    <p>
                        {data.generalInformation.email && (data.generalInformation.email)}
                    </p>
                    <p>
                        {data.generalInformation.phoneNumber && (data.generalInformation.phoneNumber)}
                    </p>
                </div>
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
                                        <span>
                                            {exp.startDate && (
                                                `${formatDate(exp.startDate, {month:true, year:true})}`
                                            )} {exp.endDate && (
                                                `- ${formatDate(exp.endDate, {month:true, year:true})}`
                                            ) || "- Present"}
                                        </span>
                                        <span>
                                            {exp.jobType != null && (
                                                ` • ${jobTypeOptions[exp.jobType].label}`
                                            )} {exp.officeType != null && (
                                                `• ${officeTypeOptions[exp.officeType].label}`
                                            )}
                                        </span>
                                    </p>

                                    <p>
                                        <span className="text-main">{exp.role}</span>
                                        <span>
                                            {exp.companyName && (
                                            ` | ${exp.companyName}`
                                            )}
                                        </span>
                                        <span>
                                            {exp.location && (
                                            ` | ${exp.location}`
                                            )}
                                        </span>
                                    </p>

                                    <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
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

                                    <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
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
                                    <span className="text-main">{cert.name}</span> {cert.issuer && (
                                        <span>{`| ${cert.issuer}`}</span>
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
                                            ` | GPA: ${edu.gpa} / 4.0`
                                        )}
                                    </p>
                                )}
                                
                                <p>
                                    <span>{edu.schoolName}</span> 
                                    <span>
                                        {edu.schoolLocation && (
                                            ` | ${edu.schoolLocation}`
                                        )}
                                    </span>
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