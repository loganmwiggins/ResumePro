import React from 'react';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';

import DescriptionEditor from '../DescriptionEditor';
import { formatDate } from '../../utils/DateFormatter';
import { officeTypeOptions, jobTypeOptions } from '../../utils/SelectOptions';
import '../../stylesheets/ResumeBuilder.css';

function Experiences({ data, handleChange, handleAddEntry, handleRemoveEntry, handleChangeResumeData}) {
    const moveEntryUp = (index) => {
        if (index > 0) {
            const newData = [...data];
    
            // Swap entries
            [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
    
            // Ensure null values remain null for dates
            ["startDate", "endDate"].forEach((key) => {
                if (data[index][key] === null) newData[index - 1][key] = null;
                if (data[index - 1][key] === null) newData[index][key] = null;
            });
    
            // Ensure empty fields remain empty
            Object.keys(newData[index]).forEach((key) => {
                if (!newData[index][key] && newData[index][key] !== false) newData[index][key] = key.includes("Date") ? null : "";
            });
    
            Object.keys(newData[index - 1]).forEach((key) => {
                if (!newData[index - 1][key] && newData[index - 1][key] !== false) newData[index - 1][key] = key.includes("Date") ? null : "";
            });
    
            // Fix Select options
            newData.forEach((entry) => {
                if (!entry.jobType) entry.jobType = null;
                if (!entry.officeType) entry.officeType = null;
            });
    
            // Update order numbers
            newData.forEach((entry, idx) => (entry.orderNumber = idx + 1));
    
            // **First State Update**
            handleChangeResumeData("experiences", [...newData]);
    
            // **Redundant Second Update (force re-render)**
            setTimeout(() => {
                handleChangeResumeData("experiences", [...newData]);
            }, 0);
        }
    };
    
    const moveEntryDown = (index) => {
        if (index < data.length - 1) {
            const newData = [...data];
    
            // Swap entries
            [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
    
            // Ensure null values remain null for dates
            ["startDate", "endDate"].forEach((key) => {
                if (data[index][key] === null) newData[index + 1][key] = null;
                if (data[index + 1][key] === null) newData[index][key] = null;
            });
    
            // Ensure empty fields remain empty
            Object.keys(newData[index]).forEach((key) => {
                if (!newData[index][key] && newData[index][key] !== false) newData[index][key] = key.includes("Date") ? null : "";
            });
    
            Object.keys(newData[index + 1]).forEach((key) => {
                if (!newData[index + 1][key] && newData[index + 1][key] !== false) newData[index + 1][key] = key.includes("Date") ? null : "";
            });
    
            // Fix Select options
            newData.forEach((entry) => {
                if (!entry.jobType) entry.jobType = null;
                if (!entry.officeType) entry.officeType = null;
            });
    
            // Update order numbers
            newData.forEach((entry, idx) => (entry.orderNumber = idx + 1));
    
            // **First State Update**
            handleChangeResumeData("experiences", [...newData]);
    
            // **Redundant Second Update (force re-render)**
            setTimeout(() => {
                handleChangeResumeData("experiences", [...newData]);
            }, 0);

            // **Redundant Second Update (force re-render)**
            setTimeout(() => {
                handleChangeResumeData("experiences", [...newData]);
            }, 1);
        }
    };
    
    
    
    

    return (
        <section>
            <div className="section-head">
                <h3>Experience</h3>
                <p>Highlight your work history by listing relevant roles that showcase your skills and achievements. List your most recent position first.</p>
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
                        {/* Entry header */}
                        <div className="entry-header">
                            {/* Entry info */}
                            <div className="entry-info">
                                <div className="entry-icon">{index + 1}</div>
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

                            {/* Entry actions */}
                            <div className="entry-btns">
                                {index > 0 && (
                                    <button
                                        type="button" 
                                        title="Move this entry up"
                                        onClick={() => moveEntryUp(index)}
                                    >
                                        <img src="/assets/icons/arrow-up.svg" draggable="false" className="icon-dynamic down-icon" />
                                    </button>
                                )}
                                {index <data.length -1 && (
                                    <button 
                                        type="button" 
                                        title="Move this entry down"
                                        onClick={() => moveEntryDown(index)}
                                    >
                                        <img src="/assets/icons/arrow-down.svg" draggable="false" className="icon-dynamic up-icon" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    title="Delete this entry"
                                    className="delete-btn"
                                    onClick={() => handleRemoveEntry("experiences", index)}
                                >
                                    <img src="/assets/icons/trash.svg" draggable="false" className="icon-dynamic" />
                                </button>
                            </div>
                        </div>

                        {/* Inputs */}
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
                                <label>Start Date <span className="req">*</span></label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange("experiences", "startDate", e.target.value || null, index)}  
                                    value={data[index].startDate || ""}  // Ensure empty string if null
                                />
                            </div>
                            <div className="input-field">
                                <label>End Date</label>
                                <input 
                                    type="date" 
                                    min = {data[index].startDate}
                                    onChange={(e) => handleChange("experiences", "endDate", e.target.value || null, index)}
                                    value={data[index].endDate || ""}  // Ensure empty string if null
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label>Job Type</label>
                                <Select
                                    options={jobTypeOptions}
                                    placeholder="Select a job type"
                                    onChange={(selectedOption) => handleChange("experiences", "jobType", selectedOption ? selectedOption.value : null, index)}
                                    value={jobTypeOptions.find(option => option.value === data[index].jobType || "")}
                                    isClearable
                                />
                            </div>
                            <div className="input-field">
                                <label>Office Type</label>
                                <Select
                                    options={officeTypeOptions}
                                    placeholder="Select an office type"
                                    onChange={(selectedOption) => handleChange("experiences", "officeType", selectedOption ? selectedOption.value : null, index)}
                                    value={officeTypeOptions.find(option => option.value === data[index].officeType) || ""}
                                    isClearable
                                />
                               
                            </div>
                        </div>
                        <div className="input-field">
                            <label>Description <span className="req">*</span></label>
                            <DescriptionEditor 
                                value={data[index].description || ""}
                                handleChange={(newValue) => handleChange("experiences", "description", newValue, index)}
                                placeholder={"Describe your role, achievements, and skills used in bulleted format"}
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
                    jobType: null,
                    orderNumber: data.length + 1
                })}
            >
                <img src="/assets/icons/plus-filled.svg" className="icon-dynamic" draggable="false" />
                <span>Add Experience</span>
            </button>
        </section>
    );
}

export default Experiences;