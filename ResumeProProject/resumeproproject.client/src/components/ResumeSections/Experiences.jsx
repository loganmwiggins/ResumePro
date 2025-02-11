import React from 'react';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';

import '../../stylesheets/ResumeBuilder.css';

function Experiences({ data, handleChange, handleAddEntry, handleRemoveEntry}) {

    const formatDate = (dateString, options = { month: true, day: true, year: true }) => {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day); // Month is zero-based
        
        // Determine the format based on the options provided
        const formatOptions = {
            ...(options.month && { month: "short" }),
            ...(options.day && { day: "numeric" }),
            ...(options.year && { year: "numeric" }),
        };
        
        return date.toLocaleDateString("en-US", formatOptions);
    };

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
        <section>
            <div className="section-head">
                <h3>Experience</h3>
                <p>Highlight your work history by listing relevant roles that showcase your skills and achievements. List your most recent position first.
                </p>
            </div>

            <AnimatePresence>
                {data.map((exp, index) => (
                    // Individual experience entry
                    <motion.div 
                        key={index}
                        className="inputs-ctnr" 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        layout
                    >
                        <div className="entry-header">
                            <div className="entry-info">
                                <div className="entry-icon">
                                    {index + 1}
                                </div>
                                <div className="entry-info-txt">
                                    <h4>
                                        {data[index].role || data[index].companyName
                                            ? `${data[index].role || data[index].companyName}${data[index].role && data[index].companyName ? " at " + data[index].companyName : ""}`
                                            : "Untitled"}
                                    </h4>
                                    <p>
                                        {data[index].startDate && formatDate(data[index].startDate, {month: true, year: true}) || "Start"} - {data[index].endDate && formatDate(data[index].endDate, {month: true, year: true}) || "Present"}
                                    </p>
                                </div>
                                
                            </div>
                            <button type="button" className="delete-btn" onClick={() => handleRemoveEntry("experiences", index)}>
                                <img src="/assets/icons/trash.svg" draggable="false" className="trash-icon" />
                            </button>
                        </div>

                        <div className="input-row">
                            <div className="input-field">
                                <label>Company / Employer <span className="req">*</span></label>
                                <input
                                    type="text"
                                    placeholder="(e.g.,  Walmart)"
                                    onChange={(e) => handleChange("experiences", "companyName", e.target.value, index)}
                                    value={data[index].companyName}
                                />
                            </div>
                            <div className="input-field">
                                <label>Job Title <span className="req">*</span></label>
                                <input
                                    type="text"
                                    placeholder="(e.g.,  Store Manager)"
                                    onChange={(e) => handleChange("experiences", "role", e.target.value, index)}
                                    value={data[index].role}
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label>Job Type</label>
                                <Select
                                    options={jobTypeOptions}
                                    placeholder="Select a job type"
                                    onChange={(selectedOption) => handleChange("experiences", "jobType", selectedOption.value, index)}
                                    value={jobTypeOptions.find(option => option.value === data[index].jobType)}
                                />
                            </div>
                            <div className="input-field">
                                <label>Office Type</label>
                                <Select
                                    options={officeTypeOptions}
                                    placeholder="Select an office type"
                                    onChange={(selectedOption) => handleChange("experiences", "officeType", selectedOption.value, index)}
                                    value={officeTypeOptions.find(option => option.value === data[index].officeType)}
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label>Start Date <span className="req">*</span></label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange("experiences", "startDate", e.target.value, index)} 
                                    value={data[index].startDate}
                                />
                            </div>
                            <div className="input-field">
                                <label>End Date</label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange("experiences", "endDate", e.target.value, index)}
                                    value={data[index].endDate}
                                />
                            </div>
                        </div>
                        
                        <div className="input-field">
                            <label>Description <span className="req">*</span></label>
                            <input 
                                type="textarea" 
                                placeholder="What did you do there?"
                                onChange={(e) => handleChange("experiences", "description", e.target.value, index)}
                                value={data[index].description}
                            />
                        </div>
                        <div className="input-field">
                            <label>Location</label>
                            <input 
                                type="text" 
                                placeholder="(e.g.,  Manhattan, NY)"
                                onChange={(e) => handleChange("experiences", "location", e.target.value, index)} 
                                value={data[index].location}
                            />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {/* Add Experience button */}
            <button 
                type="button" 
                className="add-entry-btn" 
                onClick={() => handleAddEntry("experiences", {
                    companyName: null,
                    role: null,
                    startDate: null,
                    endDate: null,
                    isCurrent: null,
                    description: null,
                    location: null,
                    officeType: null,
                    jobType: null
                })}
            >
                <img src="/assets/icons/plus-filled.svg" draggable="false" />
                <span>Add Experience</span>
            </button>
        </section>
    );
}

export default Experiences;