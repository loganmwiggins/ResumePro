import React from 'react';
import DOMPurify from 'dompurify';

import { formatDate } from '../../utils/DateFormatter';
import '../../stylesheets/Templates/Template_Bold.css';

function Template_Bold({ resumeData }) {

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
        <div className="resume-paper">
            <div className="resume-header">
                <h1>Logan Wiggins</h1>
                <p>SOFTWARE ENGINEER</p>
            </div>
            <div className="split-ctnr">
                <div className="split-left">
                    <section>
                        <h2>CONTACT</h2>
                        <span className="contact">
                            <img src="/assets/icons/email-circle.svg" draggable="false" />
                            <p>loganmwiggins1@gmail.com</p>
                        </span>
                        <span className="contact">
                            <img src="/assets/icons/phone-circle.svg" draggable="false" />
                            <p>(561) 123-4567</p>
                        </span>
                        <span className="contact">
                            <img src="/assets/icons/web-circle.svg" draggable="false" />
                            <p>loganwiggins.com</p>
                        </span>
                        <span className="contact">
                            <img src="/assets/icons/linkedin-circle.svg" draggable="false" />
                            <p>linkedin.com/in/loganwiggins</p>
                        </span>
                        <span className="contact">
                            <img src="/assets/icons/github-circle.svg" draggable="false" />
                            <p>github.com/loganmwiggins</p>
                        </span>
                        <span className="contact">
                            <img src="/assets/icons/location-circle.svg" draggable="false" />
                            <p>Deerfield Beach, FL</p>
                        </span>
                    </section>
                    <section>
                        <h2>EDUCATION</h2>
                    </section>
                    <section>
                        <h2>CERTIFICATIONS</h2>
                    </section>
                </div>
                <div className="split-right">
                    <section>
                        <h2>EXPERIENCE</h2>
                    </section>
                    <section>
                        <h2>PROJECTS</h2>
                    </section>
                    <section>
                        <h2>SKILLS</h2>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Template_Bold;