import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import DescriptionEditor from '../DescriptionEditor';
import { formatDate } from '../../utils/DateFormatter';
import '../../stylesheets/ResumeBuilder.css';

function Projects({ data, handleChange, handleAddEntry, handleRemoveEntry}) {
    return (
        <section>
            <div className="section-head">
                <h3>Projects</h3>
                <p>Showcase notable projects you have worked on, including personal, academic, or professional projects. Highlight key achievements and technologies used.</p>
            </div>

            <AnimatePresence>
                {data.map((proj, index) => (
                    // Individual project entry
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
                                    <h4>{data[index].title || "Untitled"}</h4>
                                    <p>{data[index].startDate && formatDate(data[index].startDate, {month: true, year: true}) || "Start"} {data[index].endDate && `- ${formatDate(data[index].endDate, {month: true, year: true})}`}</p>
                                </div>
                            </div>
                            <button type="button" className="delete-btn" onClick={() => handleRemoveEntry("projects", index)}>
                                <img src="/assets/icons/trash.svg" alt="Delete" className="trash-icon" />
                            </button>
                        </div>

                        {/* Inputs */}
                        <div className="input-field">
                            <label>Title <span className="req">*</span></label>
                            <input 
                                type="text"
                                placeholder="Name of project (e.g., Weather App)"
                                onChange={(e) => handleChange("projects", "title", e.target.value, index)}
                                value={data[index].title}
                            />
                        </div>
                        <div className="input-field">
                            <label>Start Date <span className="req">*</span></label>
                            <input 
                                type="date" 
                                onChange={(e) => handleChange("projects", "startDate", e.target.value, index)} 
                                value={data[index].startDate}
                            />
                        </div>
                        <div className="input-field">
                            <label>End Date</label>
                            <input 
                                type="date" 
                                min = {data[index].startDate}
                                onChange={(e) => handleChange("projects", "endDate", e.target.value, index)} 
                                value={data[index].endDate}
                            />
                        </div>
                        <div className="input-field">
                            <label>Description <span className="req">*</span></label>
                            <DescriptionEditor 
                                value={data[index].description || ""}
                                handleChange={(newValue) => handleChange("projects", "description", newValue, index)}
                                placeholder={"Summarize the project's purpose, your role, and key results in bulleted format"}
                            />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Add Project button */}
            <motion.button 
                type="button"
                className="add-entry-btn"
                onClick={() => handleAddEntry("projects", {
                    title: null,
                    description: null,
                    startDate: null,
                    endDate: null,
                    orderNumber: data.length + 1
                })}
                whileTap={{ scale: 0.9 }}
            >
                <img src="/assets/icons/plus-filled.svg" draggable="false" />
                <span>Add Project</span>
            </motion.button>
        </section>
    );
}

export default Projects;