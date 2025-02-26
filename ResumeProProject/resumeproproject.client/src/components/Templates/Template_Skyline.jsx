import React from 'react';
import DOMPurify from 'dompurify';

import { formatDate } from '../../utils/DateFormatter';
import { rgbaToString } from '../../utils/ColorFormatter';
import { officeTypeOptions, jobTypeOptions } from '../../utils/SelectOptions';
import '../../stylesheets/templates/Template_Skyline.css';

function Template_Skyline({ data, builderColor }) {
    return (
        <div 
            className="resume-paper Template_Skyline"
            style={{"--accent": rgbaToString(builderColor)}}
        >
            {/* HEADER */}
            <div className="resume-header">
                <h1>{data.generalInformation.firstName} {data.generalInformation.middleName} {data.generalInformation.lastName}</h1>
                <p>{data.generalInformation.role}</p>
            </div>

            <div className="split-ctnr">
                <div className="split-left">
                    {/* CONTACT */}
                    <section>
                        <p className="p-sec">Contact</p>
                        <div className="contact-list">
                            {data.generalInformation.email && (
                                <span className="contact">
                                    <img src="/assets/icons/email-circle.svg" draggable="false" alt="email" />
                                    <p>{data.generalInformation.email}</p>
                                </span>
                            )}
                            {data.generalInformation.phoneNumber && (
                                <span className="contact">
                                    <img src="/assets/icons/phone-circle.svg" draggable="false" alt="phone" />
                                    <p>{data.generalInformation.phoneNumber}</p>
                                </span>
                            )}
                            {data.generalInformation.websiteUrl && (
                                <span className="contact">
                                    <img src="/assets/icons/web-circle.svg" draggable="false" alt="web" />
                                    <p>{data.generalInformation.websiteUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.linkedInUrl && (
                                <span className="contact">
                                    <img src="/assets/icons/linkedin-circle.svg" draggable="false" alt="linkedIn" />
                                    <p>{data.generalInformation.linkedInUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.gitHubUrl && (
                                <span className="contact">
                                    <img src="/assets/icons/github-circle.svg" draggable="false" alt="github" />
                                    <p>{data.generalInformation.gitHubUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.location && (
                                <span className="contact">
                                    <img src="/assets/icons/location-circle.svg" draggable="false" alt="location" />
                                    <p>{data.generalInformation.location}</p>
                                </span>
                            )}
                            
                        </div>
                    </section>

                    {/* CERTIFICATIONS */}
                    {data.certifications.length > 0 && (
                        <section>
                            <p className="p-sec">Certifications</p>
                            <div className="entry-ctnr">
                                {data.certifications.map((cert, index) => (
                                    <div key={index}>
                                        <p className="p-bold">{cert.name}</p>
                                        {cert.issuer && (
                                            <p>Issued by {cert.issuer}</p>
                                        )}
                                        
                                        <p className="p-date">
                                            {cert.issueDate && (
                                                `${formatDate(cert.issueDate, {month:true, year:true})}` 
                                            )} {cert.expireDate && (
                                                `- ${formatDate(cert.expireDate, {month:true, year:true})}`
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
                            <p className="p-sec">Skills</p>
                            <div className="skills-list">
                                {Object.entries(data.skills.skillsDataJson).map(([category, skillsObj]) => (
                                    <div key={category}>
                                        <p className="p-bold">{category}:</p>
                                        <p>{Array.from(skillsObj).join(", ")}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>


                <div className="split-right">
                    {/* EXPERIENCE */}
                    {data.experiences.length > 0 && (
                        <section>
                            <p className="p-sec">Experience</p>
                            {data.experiences.map((exp, index) => {
                                let sanitizedDescription = DOMPurify.sanitize(exp.description || "", {
                                    ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                                });

                                return(
                                    <div key={index}>
                                        <div className="entry-head">
                                            <p className="p-bold">
                                                {exp.companyName} {exp.location && (
                                                    `| ${exp.location}`
                                                )}
                                            </p>

                                            <p className="p-main">{exp.role}</p>

                                            {(exp.startDate || exp.endDate) && (
                                                <p className="p-date">
                                                    {exp.startDate && (
                                                        `${formatDate(exp.startDate, {month:true, year:true})}`
                                                    )} {exp.endDate && (
                                                        `- ${formatDate(exp.endDate, {month:true, year:true})}`
                                                    ) || "- Present"} {exp.jobType != null && (
                                                        `• ${jobTypeOptions[exp.jobType].label}`
                                                    )} {exp.officeType != null && (
                                                        `• ${officeTypeOptions[exp.officeType].label}`
                                                    )}
                                                </p> 
                                            )}
                                            
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
                            <p className="p-sec">Projects</p>
                            {data.projects.map((proj, index) => {
                                let sanitizedDescription = DOMPurify.sanitize(proj.description || "", {
                                    ALLOWED_TAGS: ["b", "i", "em", "strong", "ul", "li", "ol", "p"],
                                });

                                return(
                                    <div key={index}>
                                        <div className="entry-head">
                                            <div>
                                                <p className="p-main">{proj.title}</p>
                                            </div>
                                            <div>
                                                <p className="p-date">
                                                    {proj.startDate && (
                                                        `${formatDate(proj.startDate, {month:true, year:true})}`
                                                    )} {proj.endDate && (
                                                        `- ${formatDate(proj.endDate, {month:true, year:true})}`
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
                            <p className="p-sec">Education</p>
                            {data.educations.map((edu, index) => (
                                <div key={index}>
                                    <p className="p-bold">{edu.schoolName}</p>
                                    <p className="p-main">
                                        {edu.degreeType} {edu.major && (`in ${edu.major}`)}
                                    </p>

                                    <p>
                                        {edu.schoolLocation && (
                                            `${edu.schoolLocation}`
                                        )}
                                    </p>

                                    <p>
                                        {edu.minor && `Minor in ${edu.minor}`}
                                        {edu.minor && edu.gpa && ` • `}
                                        {edu.gpa && `GPA: ${edu.gpa} / 4.0`}
                                    </p>

                                    <p className="p-date">
                                        {edu.startDate && (
                                            `${formatDate(edu.startDate, {month:true, year:true})}`
                                        )} {edu.endDate && (
                                            `- ${formatDate(edu.endDate, {month:true, year:true})}`
                                        )}
                                    </p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Template_Skyline;