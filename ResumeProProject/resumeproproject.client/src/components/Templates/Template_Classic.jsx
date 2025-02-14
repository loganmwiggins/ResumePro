import React from 'react';
import '../../stylesheets/Templates/Template_Classic.css';

function Template_Classic({ resumeData }) {

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

    const formatDate = (dateString, options = { month: true, year: true }) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        const formatOptions = {
            ...(options.month && { month: "short" }),
            ...(options.year && { year: "numeric" }),
        };

        return date.toLocaleDateString("en-US", formatOptions);
    };

    const formatCertsDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day || 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    };

    return (
        <div className="resume-classic">
            {/* HEADER */}
            <header>
                <h1>{resumeData.generalInformation.firstName} {resumeData.generalInformation.middleName} {resumeData.generalInformation.lastName}</h1>
                <h3>{resumeData.generalInformation.location}</h3>
            </header>

            {/* MAIN CONTENT - TWO COLUMNS */}
            <div className="resume-body">
                {/* LEFT COLUMN */}
                <aside className="left-column">
                    {/* CONTACT INFO */}
                    <div className="contact-info">
                        <h2>Contact</h2>
                        {resumeData.generalInformation.email && (
                            <span>
                                <img src="/assets/icons/mail-circle.svg" draggable="false" />
                                <p>{resumeData.generalInformation.email}</p>
                            </span>
                        )}
                        {resumeData.generalInformation.phoneNumber && (
                            <span>
                                <img src="/assets/icons/phone-circle.svg" draggable="false" />
                                <p>{resumeData.generalInformation.phoneNumber}</p>
                            </span>
                        )}
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

                    {/* SKILLS */}
                    {resumeData.skills?.skillsDataJson && Object.keys(resumeData.skills.skillsDataJson).length > 0 && (
                        <div className="skills">
                            <h2>Skills</h2>
                            {Object.entries(resumeData.skills.skillsDataJson).map(([category, skillsObj]) => (
                                <p key={category}><strong>{category}:</strong> {Array.from(skillsObj).join(", ")}</p>
                            ))}
                        </div>
                    )}

                    {/* CERTIFICATIONS */}
                    {resumeData.certifications.length > 0 && (
                        <div className="certifications">
                            <h2>Certifications</h2>
                            {resumeData.certifications.map(cert => (
                                <div key={cert.name} className="cert-item">
                                    <p>
                                        <strong>{'\u2022'}  {cert.name}</strong> - {cert.issuer}
                                        {cert.issueDate && cert.expireDate
                                            ? ` (${formatCertsDate(cert.issueDate)} - ${formatCertsDate(cert.expireDate)})`
                                            : cert.issueDate
                                                ? ` (Issued: ${formatCertsDate(cert.issueDate)})`
                                                : cert.expireDate
                                                    ? ` | Expires: ${formatCertsDate(cert.expireDate)}`
                                                    : ""}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </aside>

                {/* RIGHT COLUMN */}
                <main className="right-column">
                    {/* EXPERIENCE */}
                    {resumeData.experiences.length > 0 && (
                        <div className="experience-item">
                            <h2>Experience</h2>
                            {resumeData.experiences.map(exp => (
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
                                                {exp.startDate && formatDate(exp.startDate)}
                                                {exp.endDate ? ` - ${formatDate(exp.endDate)}` : " - Present"}
                                            </p>
                                            <p>{exp.location}</p>
                                        </div>
                                    </div>
                                    <p>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* EDUCATION */}
                    {resumeData.educations.length > 0 && (
                        <div className="education-item">
                            <h2>Education</h2>
                            {resumeData.educations.map(edu => (
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

                    {/* PROJECTS */}
                    {resumeData.projects.length > 0 && (
                        <section className="projects">
                            <h2>Projects</h2>
                            {resumeData.projects.map(proj => (
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
                </main>
            </div>
        </div>
    );
}

export default Template_Classic;
