import React from 'react';
import DOMPurify from 'dompurify';

import { formatDate } from '../../utils/DateFormatter';
import '../../stylesheets/Templates/Template_BoldNavy.css';

function Template_BoldNavy({ data }) {

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

    return (
        <div className="resume-paper Template_BoldNavy">
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
                                    <img src="/assets/icons/email-circle.svg" draggable="false" />
                                    <p>{data.generalInformation.email}</p>
                                </span>
                            )}
                            {data.generalInformation.phoneNumber && (
                                <span className="contact">
                                    <img src="/assets/icons/phone-circle.svg" draggable="false" />
                                    <p>{data.generalInformation.phoneNumber}</p>
                                </span>
                            )}
                            {data.generalInformation.websiteUrl && (
                                <span className="contact">
                                    <img src="/assets/icons/web-circle.svg" draggable="false" />
                                    <p>{data.generalInformation.websiteUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.linkedInUrl && (
                                <span className="contact">
                                    <img src="/assets/icons/linkedin-circle.svg" draggable="false" />
                                    <p>{data.generalInformation.linkedInUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.gitHubUrl && (
                                <span className="contact">
                                    <img src="/assets/icons/github-circle.svg" draggable="false" />
                                    <p>{data.generalInformation.gitHubUrl}</p>
                                </span>
                            )}
                            {data.generalInformation.location && (
                                <span className="contact">
                                    <img src="/assets/icons/location-circle.svg" draggable="false" />
                                    <p>{data.generalInformation.location}</p>
                                </span>
                            )}
                            
                        </div>
                    </section>

                    {/* CERTIFICATIONS */}
                    <section>
                        <p className="p-sec">Certifications</p>
                        <div>
                            <p className="p-main">Azure Fundamentals</p>
                            <p className="p-date">Issued by Microsoft</p>
                            <p>Dec 2024 - Dec 2026</p>
                        </div>
                    </section>

                    {/* SKILLS */}
                    <section>
                        <p className="p-sec">Skills</p>
                        <div>
                            <p className="p-main">Languages & Frameworks</p>
                            <p>C#, ASP.NET, Entity Framework, SQL, Angular, React, HTML, CSS, JavaScript</p>
                        </div>
                        <div>
                            <p className="p-main">Development Tools</p>
                            <p>C#, ASP.NET, Entity Framework, SQL, Angular, React, HTML, CSS, JavaScript</p>
                        </div>
                    </section>
                </div>
                <div className="split-right">
                    {/* EXPERIENCE */}
                    <section>
                        <p className="p-sec">Experience</p>
                        <div>
                            <div className="entry-head">
                                <div>
                                    <p className="p-main">Software Engineer</p>
                                    <p>Microsoft | Full-time | Hybrid</p>
                                </div>
                                <div>
                                    <p className="p-date">Jun 2021 - Jul 2025</p>
                                    <p>Tallahassee, FL</p>
                                </div>
                            </div>
                            <p>
                                <ul>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                </ul>
                            </p>
                        </div>
                        {/* <div key={exp.description}>
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
                            <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></p>
                        </div> */}
                    </section>

                    {/* PROJECTS */}
                    <section>
                        <p className="p-sec">Projects</p>
                        <div>
                            <div className="entry-head">
                                <div>
                                    <p className="p-main">Project Name</p>
                                </div>
                                <div>
                                    <p className="p-date">Jun 2021 - Jul 2025</p>
                                </div>
                            </div>
                            <p>
                                <ul>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                    <li>Hello</li>
                                </ul>
                            </p>
                        </div>
                    </section>
                    
                    {/* EDUCATION */}
                    <section>
                        <p className="p-sec">Education</p>
                        <div>
                            <div className="entry-head">
                                <div>
                                    <p className="p-main">Bachelor of Science in computer science</p>
                                </div>
                                <div>
                                    <p className="p-date">Aug 2020 - May 2024</p>
                                    <p>Tallahassee, FL</p>
                                </div>
                            </div>
                            <p className="p-date">Minor in Computer Science</p>
                            <p>Florida State University | GPA: 4.0 / 4.0</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Template_BoldNavy;