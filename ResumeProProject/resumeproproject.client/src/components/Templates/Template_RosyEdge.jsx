import React from 'react';
import DOMPurify from 'dompurify';

import { formatDate } from '../../utils/DateFormatter';
import { officeTypeOptions, jobTypeOptions } from '../../utils/SelectOptions';
import '../../stylesheets/Templates/Template_RosyEdge.css';

function Template_RosyEdge({ data }) {

    const formatCertsDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day || 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    };

    return (
        <div className="resume-paper Template_RosyEdge">
            <header>
                <h1>{data.generalInformation.firstName} {data.generalInformation.middleName} {data.generalInformation.lastName}</h1>
                <div>
                    <h3>{data.generalInformation.role}</h3>
                    <h3>{data.generalInformation.location}</h3>
                </div>
            </header>

            <div className="resume-body">
                <aside className="left-column">
                    <div className="contact-info">
                        <h2>Contact</h2>
                        {data.generalInformation.email && (
                            <span>
                                <img src="/assets/icons/email-circle.svg" draggable="false" />
                                <p>{data.generalInformation.email}</p>
                            </span>
                        )}
                        {data.generalInformation.phoneNumber && (
                            <span>
                                <img src="/assets/icons/phone-circle.svg" draggable="false" />
                                <p>{data.generalInformation.phoneNumber}</p>
                            </span>
                        )}
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

                    {/* SKILLS */}
                    {data.skills?.skillsDataJson && Object.keys(data.skills.skillsDataJson).length > 0 && (
                        <div className="skills">
                            <h2>Skills</h2>
                            {Object.entries(data.skills.skillsDataJson).map(([category, skillsObj]) => (
                                <p key={category}><strong>{category}:</strong> {Array.from(skillsObj).join(", ")}</p>
                            ))}
                        </div>
                    )}

                    {/* CERTIFICATIONS */}
                    {data.certifications.length > 0 && (
                        <div className="certifications">
                            <h2>Certifications</h2>
                            {data.certifications.map(cert => (
                                <div key={cert.name} className="cert-item">
                                    <p>
                                        <strong>{cert.name}</strong> - {cert.issuer}
                                        {cert.issueDate && cert.expireDate
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
                    )}
                </aside>

                <main className="right-column">
                    {/* EXPERIENCE */}
                    {data.experiences.length > 0 && (
                        <div className="experience-item">
                            <h2>Experience</h2>
                            {data.experiences.map(exp => {
                                let sanitizedDescription = DOMPurify.sanitize(exp.description || "", {
                                    ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                                });

                                return (
                                    <div key={exp.description}>
                                        <div className="entry-head">
                                            <div>
                                                <h3>{exp.role}</h3>
                                                <p className="company">
                                                    {exp.companyName} {exp.jobType != null && `| ${jobTypeOptions[exp.jobType].label}`} {exp.officeType != null && `| ${officeTypeOptions[exp.officeType].label}`}
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

                                        <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* PROJECTS */}
                    {data.projects.length > 0 && (
                        <section className="projects">
                            <h2>Projects</h2>
                            {data.projects.map(proj => (
                                <div key={proj.title} className="project-item">
                                    <h3>{proj.title}</h3>
                                    <p className="date">
                                        {proj.startDate && formatDate(proj.startDate)} -
                                        {proj.endDate ? formatDate(proj.endDate) : " Present"}
                                    </p>
                                    <p>{proj.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* EDUCATION */}
                    {data.educations.length > 0 && (
                        <div className="education-item">
                            <h2>Education</h2>
                            {data.educations.map(edu => (
                                <div key={edu.startDate}>
                                    <div className="entry-head">
                                        <div>
                                            <h3>
                                                {edu.degreeType} {edu.major && `in ${edu.major}`}
                                            </h3>
                                            <h4>
                                                {edu.minor && `Minor in ${edu.minor}`}
                                            </h4>
                                            <p className="school">
                                                {edu.schoolName} {edu.gpa && `| GPA: ${edu.gpa} / 4.0`}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                {edu.startDate && formatDate(edu.startDate)}
                                                {edu.endDate ? ` - ${formatDate(edu.endDate)}` : " - Present"}
                                            </p>
                                            <p>{edu.schoolLocation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Template_RosyEdge;