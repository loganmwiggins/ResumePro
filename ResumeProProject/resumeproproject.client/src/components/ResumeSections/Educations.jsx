import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { formatDate } from '../../utils/DateFormatter';
import '../../stylesheets/ResumeBuilder.css';

function Educations({ data, handleChange, handleAddEntry, handleRemoveEntry}) {
    return (
        <section>
            <div className="section-head">
                <h3>Education</h3>
                <p>Include your academic background to demonstrate your qualifications and expertise. Generally, only degrees from universities or colleges are listed.</p>
            </div>

            <AnimatePresence>
                {data.map((edu, index) => (
                    // Individual education entry
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
                            <div className="entry-info">
                                <div className="entry-icon">{index + 1}</div>
                                <div className="entry-info-txt">
                                    <h4>{data[index].schoolName || "Untitled"}</h4>
                                    {data[index].startDate && formatDate(data[index].startDate, {month: true, year: true}) || "Start"} - {data[index].endDate && formatDate(data[index].endDate, {month: true, year: true}) || "End"}
                                </div>
                            </div>
                            <button 
                                type="button" 
                                className="delete-btn" 
                                onClick={() => handleRemoveEntry("educations", index)}
                            >
                                <img src="/assets/icons/trash.svg" draggable="false" className="trash-icon" />
                            </button>
                        </div>

                        {/* Inputs */}
                        <div className="input-row">
                            <div className="input-field">
                                <label>School / University <span className="req">*</span></label>
                                <input 
                                    type="text"
                                    placeholder="(e.g.,  Florida State University)"
                                    onChange={(e) => handleChange("educations", "schoolName", e.target.value, index)}
                                    value={data[index].schoolName}
                                />
                            </div>
                            <div className="input-field">
                                <label>Location</label>
                                <input 
                                    type="text"
                                    placeholder="(e.g.,  Tallahassee, FL)"
                                    onChange={(e) => handleChange("educations", "schoolLocation", e.target.value, index)}
                                    value={data[index].schoolLocation}
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label>Degree Type <span className="req">*</span></label>
                                <input 
                                    type="text"
                                    placeholder="(e.g., Bachelor of Science)"
                                    onChange={(e) => handleChange("educations", "degreeType", e.target.value, index)}
                                    value={data[index].degreeType}
                                />
                            </div>
                            <div className="input-field">
                                <label>Major <span className="req">*</span></label>
                                <input 
                                    type="text"
                                    placeholder="(e.g.,  Finance, Computer Science)"
                                    onChange={(e) => handleChange("educations", "major", e.target.value, index)}
                                    value={data[index].major}
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label>Minor</label>
                                <input 
                                    type="text"
                                    placeholder="(e.g., Information Technology, Design, Architecture)"
                                    onChange={(e) => handleChange("educations", "minor", e.target.value, index)}
                                    value={data[index].minor}
                                />
                            </div>
                            <div className="input-field">
                                <label>GPA</label>
                                <input 
                                    type="number"
                                    placeholder="Typically only include if above 3.0"
                                    min={0.0}
                                    max={4.0}
                                    onChange={(e) => handleChange("educations", "gpa", e.target.value, index)}
                                    value={data[index].gpa}
                                />
                            </div>
                        </div>
                        
                        <div className="input-row">
                            <div className="input-field">
                                <label>Start Date <span className="req">*</span></label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange("educations", "startDate", e.target.value, index)} 
                                    value={data[index].startDate}
                                />
                            </div>
                            <div className="input-field">
                                <label>End Date <span className="req">*</span></label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange("educations", "endDate", e.target.value, index)} 
                                    value={data[index].endDate}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Add Education button */}
            <motion.button 
                type="button" 
                className="add-entry-btn"
                onClick={() => handleAddEntry("educations", {
                    schoolName: null,
                    schoolLocation: null,
                    degreeType: null,
                    gpa: null,
                    major: null,
                    minor: null,
                    startDate: null,
                    endDate: null,
                })}
                whileTap={{ scale: 0.9 }}
            >
                <img src="/assets/icons/plus-filled.svg" draggable="false" />
                <span>Add Education</span>
            </motion.button>
        </section>
    );
}

export default Educations;