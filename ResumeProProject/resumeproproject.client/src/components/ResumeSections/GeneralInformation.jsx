import React from "react";
import '../../stylesheets/ResumeBuilder.css';


function GeneralInformation({ data, handleChange }) {
    return (
        <section>
            <h3>General Information</h3>
            <div className="inputs-ctnr">
                <div className="input-field">
                    <label>First Name <span className="req">*</span></label>
                    <input 
                        type="text" 
                        placeholder="EX:  John"
                        onChange={(e) => handleChange("generalInformation", "firstName", e.target.value)}
                        value={data.firstName}
                    />
                </div>
                <div className="input-field">
                    <label>Middle Name / Initial</label>
                    <input 
                        type="text" 
                        placeholder="EX:  Elizabeth / E"
                        onChange={(e) => handleChange("generalInformation", "middleName", e.target.value)}
                        value={data.middleName}
                    />
                </div>
                <div className="input-field">
                    <label>Last Name <span className="req">*</span></label>
                    <input 
                        type="text" 
                        placeholder="EX:  Doe"
                        onChange={(e) => handleChange("generalInformation", "lastName", e.target.value)} 
                        value={data.lastName}
                    />
                </div>
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
                <div className="input-field">
                    <label>Location</label>
                    <input
                        type="text"
                        placeholder="EX:  Miami, FL"
                        onChange={(e) => handleChange("generalInformation", "location", e.target.value)}
                        value={data.location}
                    />
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