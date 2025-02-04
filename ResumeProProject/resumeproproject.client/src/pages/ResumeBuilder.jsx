import React from 'react';

import '../stylesheets/ResumeBuilder.css';
import AuthorizeView from '../components/AuthorizeView';

function ResumeBuilder() {
  return (
    <AuthorizeView>
        <div className="builder-ctnr">
            <div className="template-view">
                x
            </div>
            <div className="build-view">
                <form action="">
                    {/* General Information */}
                    <section id="general-information">
                        <h3>General Information</h3>
                        <div className="inputs-ctnr">
                            {/* First Name */}
                            <div className="input-field">
                                <label>First Name *</label>
                                <input 
                                    type="text" 
                                    name="firstName"
                                    placeholder="Enter first name"
                                />
                            </div>

                            {/* Middle Name */}
                            <div className="input-field">
                                <label>Middle Name</label>
                                <input 
                                    type="text" 
                                    name="middleName"
                                    placeholder="Enter middle name"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="input-field">
                                <label>Last Name *</label>
                                <input 
                                    type="text" 
                                    name="lastName"
                                    placeholder="Enter last name"
                                />
                            </div>

                            {/* Email */}
                            <div className="input-field">
                                <label>Email</label>
                                <input 
                                    type="text" 
                                    name="email"
                                    placeholder="Enter email address"
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="input-field">
                                <label>Phone Number</label>
                                <input 
                                    type="text" 
                                    name="phoneNumber"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            
                            {/* Website URL */}
                            <div className="input-field">
                                <label>Website URL</label>
                                <input 
                                    type="text" 
                                    name="websiteUrl"
                                    placeholder="Enter website URL"
                                />
                            </div>

                            {/* LinkedIn URL */}
                            <div className="input-field">
                                <label>LinkedIn URL</label>
                                <input 
                                    type="text" 
                                    name="linkedinUrl"
                                    placeholder="Enter LinkedIn URL"
                                />
                            </div>

                            {/* GitHub URL */}
                            <div className="input-field">
                                <label>GitHub URL</label>
                                <input 
                                    type="text" 
                                    name="githubUrl"
                                    placeholder="Enter GitHub URL"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Experience */}
                    <section id="experience">
                        <h3>Experience</h3>
                        <div className="inputs-ctnr">
                            {/* Company Name */}
                            <div className="input-field">
                                <label>Company/Employer *</label>
                                <input 
                                    type="text" 
                                    name="companyName"
                                    placeholder="Enter name of company"
                                />
                            </div>

                            {/* Role */}
                            <div className="input-field">
                                <label>Role *</label>
                                <input 
                                    type="text" 
                                    name="role"
                                    placeholder="Enter your role at the company"
                                />
                            </div>

                            {/* Location */}
                            <div className="input-field">
                                <label>Location</label>
                                <input 
                                    type="text" 
                                    name="location"
                                    placeholder="City, State"
                                />
                            </div>

                            {/* Office Type */}
                            <div className="input-field">
                                <label>Office Type</label>
                                <select name="officeType">
                                    <option value="onsite">On-site</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>

                            {/* Job Type */}
                            <div className="input-field">
                                <label>Job Type</label>
                                <select name="jobType">
                                    <option value="fulltime">Full-time</option>
                                    <option value="parttime">Part-time</option>
                                    <option value="internship">Internship</option>
                                    <option value="volunteer">Volunteer</option>
                                </select>
                            </div>

                            {/* Start Date */}
                            <div className="input-field">
                                <label>Start Date *</label>
                                <input 
                                    type="text" 
                                    name="startDate"
                                    placeholder="Enter the date you started"
                                />
                            </div>

                            {/* End Date */}
                            <div className="input-field">
                                <label>End Date</label>
                                <input 
                                    type="text" 
                                    name="endDate"
                                    placeholder="Enter the date you left"
                                />
                            </div>

                            {/* Is Current? */}
                            <div className="input-field">
                                <label>Current? *</label>
                                <input 
                                    type="checkbox" 
                                    name="isCurrent"
                                />
                            </div>

                            {/* Description */}
                            <div className="input-field">
                                <label>Description *</label>
                                <input 
                                    type="textarea" 
                                    name="description"
                                    placeholder="What did you do there?"
                                />
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    </AuthorizeView>
  )
}

export default ResumeBuilder;