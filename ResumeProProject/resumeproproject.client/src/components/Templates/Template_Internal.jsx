import React from 'react';
import DOMPurify from 'dompurify';

import { formatDate } from '../../utils/DateFormatter';
import { lightenColor, rgbaToString } from '../../utils/ColorFormatter';
import { officeTypeOptions, jobTypeOptions } from '../../utils/SelectOptions';
import '../../stylesheets/templates/Template_Internal.css';

function Template_Internal({ data, color, textSize }) {
    return (
        <div 
            className="resume-paper Template_Internal"
            style={{
                "--accent": rgbaToString(color),
                "--accent-light": lightenColor(color, .2),
                "--scale-factor": textSize
            }}
        >
            {/* HEADER */}
            <div className="resume-header">
                <div>
                    <h1>{data.generalInformation.firstName} {data.generalInformation.middleName} {data.generalInformation.lastName}</h1>
                    <p>{data.generalInformation.role}</p>
                </div>
                <div>
                    <img src="/assets/images/jmf-logo-cropped.PNG" draggable="false" />
                </div>
            </div>

            <div className="split-ctnr">
                <div className="split-left">
                    {/* EXPERIENCE */}
                    {data.experiences.length > 0 && (
                        <section>
                            <h1 className="h1-sec">Experience</h1>
                            <div className="section-list">
                                {data.experiences.map((exp, index) => {
                                    let sanitizedDescription = DOMPurify.sanitize(exp.description || "", {
                                        ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                                    });

                                    return(
                                        <div key={index} className="entry">
                                            <div className="entry-head">
                                                <div className="entry-head-left">
                                                    <p className="p-main">{exp.role}</p>
                                                    <div>
                                                        {(exp.startDate || exp.endDate) && (
                                                            <p className="p-date">
                                                                {exp.startDate && (
                                                                    `${formatDate(exp.startDate, {month:true, year:true})}`
                                                                )} {exp.endDate && (
                                                                    `- ${formatDate(exp.endDate, {month:true, year:true})}`
                                                                ) || "- Present"}
                                                            </p>
                                                        )}
                                                        <p className="p-sub">
                                                            {exp.location} {exp.jobType != null && (
                                                                `| ${jobTypeOptions[exp.jobType].label}`
                                                            )} {exp.officeType != null && (
                                                                `| ${officeTypeOptions[exp.officeType].label}`
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="entry-head-right">
                                                    {exp.companyName && (
                                                        <div className="p-bubble">
                                                            <p>{exp.companyName}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

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
                            <h1 className="h1-sec">Projects</h1>
                            <div className="section-list">
                                {data.projects.map((proj, index) => {
                                    let sanitizedDescription = DOMPurify.sanitize(proj.description || "", {
                                        ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                                    });

                                    return(
                                        <div key={index} className="entry">
                                            <div className="entry-head">
                                                <div className="entry-head-left">
                                                    <div>
                                                        <p className="p-main">{proj.title}</p>
                                                        <p className="p-sub">
                                                            {proj.startDate && (
                                                                `${formatDate(proj.startDate, {month:true, year:true})}`
                                                            )} {proj.endDate && (
                                                                `- ${formatDate(proj.endDate, {month:true, year:true})}`
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {sanitizedDescription && (
                                                <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                    
                    {/* EDUCATION */}
                    {data.educations.length > 0 && (
                        <section>
                            <h1 className="h1-sec">Education</h1>
                            <div className="section-list">
                                {data.educations.map((edu, index) => (
                                    <div key={index} className="entry">
                                        <div className="entry-head">
                                            <div className="entry-head-left">
                                                <div>
                                                    <p className="p-main">
                                                        {edu.degreeType} {edu.major && (`in ${edu.major}`)}
                                                    </p>
                                                    <p>{edu.minor && (`Minor in ${edu.minor}`)}</p>
                                                </div>
                                                

                                                <div>
                                                    <p className="p-sub">
                                                        {edu.startDate && (
                                                            `${formatDate(edu.startDate, {month:true, year:true})}`
                                                        )} {edu.endDate && (
                                                            `- ${formatDate(edu.endDate, {month:true, year:true})}`
                                                        )}
                                                    </p>
                                                    <p className="p-sub">
                                                        {edu.gpa && (`GPA: ${edu.gpa} / 4.0`)}
                                                    </p>
                                                    <p className="p-sub">
                                                        {edu.schoolLocation && (
                                                            `${edu.schoolLocation}`
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="entry-head-right">
                                                {edu.schoolName && (
                                                    <div className="p-bubble">
                                                        <p>{edu.schoolName}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="split-right">
                    {/* CONTACT */}
                    <section>
                        <h1 className="h1-sec">Contact</h1>
                        <div className="section-list">
                            {data.generalInformation.email && (
                                <span className="entry-small contact">
                                    <p>Email</p>
                                    <p className="p-accent">{data.generalInformation.email}</p>
                                </span>
                            )}
                            {data.generalInformation.phoneNumber && (
                                <span className="entry-small contact">
                                    <p>Phone</p>
                                    <p className="p-accent">{data.generalInformation.phoneNumber}</p>
                                </span>
                            )}
                            {data.generalInformation.websiteUrl && (
                                <span className="entry-small contact">
                                    <p>Website</p>
                                    <p className="p-accent">{data.generalInformation.websiteUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.linkedInUrl && (
                                <span className="entry-small contact">
                                    <p>LinkedIn</p>
                                    <p className="p-accent">{data.generalInformation.linkedInUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.gitHubUrl && (
                                <span className="entry-small contact">
                                    <p>GitHub</p>
                                    <p className="p-accent">{data.generalInformation.gitHubUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.location && (
                                <span className="entry-small contact">
                                    <p>Location</p>
                                    <p className="p-accent">{data.generalInformation.location}</p>
                                </span>
                            )}
                        </div>
                    </section>

                    {/* CERTIFICATIONS */}
                    {data.certifications.length > 0 && (
                        <section>
                            <h1 className="h1-sec">Certifications</h1>
                            <div className="section-list">
                                {data.certifications.map((cert, index) => (
                                    <div key={index} className="entry-small">
                                        <p>{cert.issuer}</p>
                                        <p className="p-main">{cert.name}</p>

                                        <p className="p-sub">
                                            {cert.issueDate && cert.expireDate
                                                ? ` Issued: ${formatDate(cert.issueDate, { month: true, year: true })} | Expires: ${formatDate(cert.expireDate, { month: true, year: true })}`
                                                : cert.issueDate
                                                    ? `Issued: ${formatDate(cert.issueDate, { month: true, year: true })}`
                                                    : cert.expireDate
                                                        ? ` | Expires: ${formatDate(cert.expireDate, { month: true, year: true })}`
                                                        : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SKILLS */}
                    {data.skills?.skillsDataJson && Object.keys(data.skills.skillsDataJson).length > 0 && (
                        <section>
                            <h1 className="h1-sec">Skills</h1>
                            <div className="section-list">
                                {Object.entries(data.skills.skillsDataJson).map(([category, skillsObj]) => (
                                    <div key={category} className="entry-small">
                                        <p className="p-main">{category}</p>
                                        <p>{Array.from(skillsObj).join(", ")}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Template_Internal;