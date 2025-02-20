import React from 'react';
import DOMPurify from 'dompurify';

import { formatDate } from '../../utils/DateFormatter';
import { officeTypeOptions, jobTypeOptions } from '../../utils/SelectOptions';
import '../../stylesheets/Templates/Template_RosyEdge.css';

function Template_RosyEdge({ data }) {
    return (
        <div className="resume-paper Template_RosyEdge">
            {/* HEADER */}
            <header>
                <h1>{data.generalInformation.firstName} {data.generalInformation.middleName} {data.generalInformation.lastName}</h1>
                <div>
                    {data.generalInformation.role && (
                        <h3>{data.generalInformation.role}</h3>
                    )}
                    {data.generalInformation.location && (
                        <h3>{data.generalInformation.location}</h3>
                    )}
                </div>
            </header>

            <div className="resume-body">
                <aside className="left-column">
                    {/* CONTACT */}
                    <div>
                        <h2>Contact</h2>
                        <div className="contact-info">
                            {data.generalInformation.email && (
                                <span>
                                    <img src="/assets/icons/email-circle.svg" draggable="false" alt="email" />
                                    <p>{data.generalInformation.email}</p>
                                </span>
                            )}
                            {data.generalInformation.phoneNumber && (
                                <span>
                                    <img src="/assets/icons/phone-circle.svg" draggable="false" alt="phone" />
                                    <p>{data.generalInformation.phoneNumber}</p>
                                </span>
                            )}
                            {data.generalInformation.websiteUrl && (
                                <span>
                                    <img src="/assets/icons/web-circle.svg" draggable="false" alt="web" />
                                    <p>{data.generalInformation.websiteUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.linkedInUrl && (
                                <span>
                                    <img src="/assets/icons/linkedin-circle.svg" draggable="false" alt="linkedIn" />
                                    <p>{data.generalInformation.linkedInUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.gitHubUrl && (
                                <span>
                                    <img src="/assets/icons/github-circle.svg" draggable="false" alt="github" />
                                    <p>{data.generalInformation.gitHubUrl}</p>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* SKILLS */}
                    {data.skills?.skillsDataJson && Object.keys(data.skills.skillsDataJson).length > 0 && (
                        <div className="skills">
                            <h2>Skills</h2>
                            <div className="skills-ctnr">
                                {Object.entries(data.skills.skillsDataJson).map(([category, skillsObj]) => (
                                    <div key={category} className="skill-sec">
                                        <p><strong>{category}</strong></p>
                                        <p>{Array.from(skillsObj).join(", ")}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CERTIFICATIONS */}
                    {data.certifications.length > 0 && (
                        <div className="certifications">
                            <h2>Certifications</h2>
                            <div className="cert-ctnr">
                                {data.certifications.map((cert, index) => (
                                    <div key={index} className="cert-item">
                                        <p><strong>{cert.name}</strong></p>
                                        <p>
                                            {cert.issuer} {cert.issueDate && cert.expireDate
                                                ? ` (${formatDate(cert.issueDate, { month: true, year: true })} - ${formatDate(cert.expireDate, { month: true, year: true })})`
                                                : cert.issueDate
                                                    ? ` (Issued: ${formatDate(cert.issueDate, { month: true, year: true })})`
                                                    : cert.expireDate
                                                        ? ` | Expires: ${formatDate(cert.expireDate, { month: true, year: true })}`
                                                        : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                <main className="right-column">
                    {/* EXPERIENCE */}
                    {data.experiences.length > 0 && (
                        <section>
                            <h2>Experience</h2>
                            {data.experiences.map((exp, index) => {
                                let sanitizedDescription = DOMPurify.sanitize(exp.description || "", {
                                    ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                                });

                                return (
                                    <div key={index}>
                                        <div className="entry-head">
                                            <div>
                                                <h3>{exp.role}</h3>
                                                <p className="subtitle">{exp.companyName}</p>
                                                <p className="subtitle">
                                                    {exp.jobType != null && (jobTypeOptions[exp.jobType].label)}
                                                    {exp.jobType != null && exp.officeType != null && ` | `}
                                                    {exp.officeType != null && (officeTypeOptions[exp.officeType].label)}
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    {exp.startDate && formatDate(exp.startDate, { month: true, year: true })}
                                                    {exp.endDate ? ` - ${formatDate(exp.endDate, { month: true, year: true })}` : " - Present"}
                                                </p>
                                                <p>{exp.location}</p>
                                            </div>
                                        </div>

                                        {sanitizedDescription && (
                                            <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
                                        )}
                                    </div>
                                );
                            })}
                        </section>
                    )}

                    {/* PROJECTS */}
                    {data.projects.length > 0 && (
                        <section>
                            <h2>Projects</h2>
                            {data.projects.map((proj, index) => {
                                let sanitizedDescription = DOMPurify.sanitize(proj.description || "", {
                                    ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                                });

                                return(
                                    <div key={index} className="project-item">
                                        <div className="entry-head">
                                            <div>
                                                <h3>{proj.title}</h3>
                                            </div>
                                            <div>
                                                <p className="p-date">
                                                    {proj.startDate && (
                                                        `${formatDate(proj.startDate, {month: true, year: true})}`
                                                    )} {proj.endDate && (
                                                        `- ${formatDate(proj.endDate, {month: true, year: true})}`
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                                    
                                        {sanitizedDescription && (
                                            <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
                                        )}
                                    </div>
                                );
                            })}
                        </section>
                    )}

                    {/* EDUCATION */}
                    {data.educations.length > 0 && (
                        <section>
                            <h2>Education</h2>
                            {data.educations.map((edu, index) => (
                                <div key={index}>
                                    <div className="edu-head">
                                        <div>
                                            <h3>
                                                {edu.degreeType} {edu.major && `in ${edu.major}`}
                                            </h3>
                                        </div>
                                        <div>
                                            <p>
                                                {edu.startDate && (
                                                    `${formatDate(edu.startDate, {month:true, year:true})}`
                                                )} {edu.endDate && (
                                                    `- ${formatDate(edu.endDate, {month:true, year:true})}`
                                                )}
                                            </p>
                                            <p>{edu.schoolLocation}</p>
                                        </div>
                                    </div>

                                    <p className="subtitle">
                                        {edu.minor && `Minor in ${edu.minor}`}
                                    </p>
                                    <p>
                                        {edu.schoolName} {edu.schoolName && edu.gpa && (` | `)} {edu.gpa && (`GPA: ${edu.gpa} / 4.0`)}
                                    </p>
                                </div>
                            ))}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Template_RosyEdge;