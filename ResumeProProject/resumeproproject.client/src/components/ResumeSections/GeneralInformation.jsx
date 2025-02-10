import React from 'react';
import '../../stylesheets/ResumeBuilder.css';


function GeneralInformation({ data, handleChange }) {
    return (
        <section>
            <div className="section-head">
                <h3>General Information</h3>
                <p>Include your personal details in this section.</p>
            </div>

            <div className="inputs-ctnr">
                <div className="input-row">
                    <div className="input-field">
                        <label>First Name <span className="req">*</span></label>
                        <input 
                            type="text" 
                            placeholder="(e.g.,  John)"
                            onChange={(e) => handleChange("generalInformation", "firstName", e.target.value)}
                            value={data.firstName}
                        />
                    </div>
                    <div className="input-field">
                        <label>Middle Name / Initial</label>
                        <input 
                            type="text" 
                            placeholder="(e.g.,  Elizabeth or E)"
                            onChange={(e) => handleChange("generalInformation", "middleName", e.target.value)}
                            value={data.middleName}
                        />
                    </div>
                </div>
                <div className="input-field">
                    <label>Last Name <span className="req">*</span></label>
                    <input 
                        type="text" 
                        placeholder="(e.g.,  Doe)"
                        onChange={(e) => handleChange("generalInformation", "lastName", e.target.value)} 
                        value={data.lastName}
                    />
                </div>
                <div className="input-row">
                    <div className="input-field">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="EX:  john.doe@example.com"
                            onChange={(e) => handleChange("generalInformation", "email", e.target.value)}
                            value={data.email}
                        />
                    </div>
                    <div className="input-field">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            placeholder="EX:  (123) 456-7890"
                            onChange={(e) => handleChange("generalInformation", "phoneNumber", e.target.value)}
                            value={data.phoneNumber}
                        />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-field">
                        <label>Role</label>
                        <input
                            type="text"
                            placeholder="(e.g., Software Engineer)"
                            onChange={(e) => handleChange("generalInformation", "role", e.target.value)}
                            value={data.role}
                        />
                    </div>
                    <div className="input-field">
                        <label>Location</label>
                        <input
                            type="text"
                            placeholder="(e.g., Miami, FL)"
                            onChange={(e) => handleChange("generalInformation", "location", e.target.value)}
                            value={data.location}
                        />
                    </div>
                </div>
                <div className="input-field">
                    <label>Website URL</label>
                    <input 
                        type="text" 
                        placeholder="EX:  johndoe.com"
                        onChange={(e) => handleChange("generalInformation", "websiteUrl", e.target.value)}
                        value={data.websiteUrl}
                    />
                </div>
                <div className="input-field">
                    <label>LinkedIn URL</label>
                    <input 
                        type="text" 
                        placeholder="EX:  linkedin.com/in/johndoe"
                        onChange={(e) => handleChange("generalInformation", "linkedInUrl", e.target.value)}
                        value={data.linkedInUrl}
                    />
                </div>
                <div className="input-field">
                    <label>GitHub URL</label>
                    <input
                        type="text"
                        placeholder="EX:  github.com/johndoe"
                        onChange={(e) => handleChange("generalInformation", "gitHubUrl", e.target.value)}
                        value={data.gitHubUrl}
                    />
                </div>
            </div>
        </section>
    );
}

export default GeneralInformation;