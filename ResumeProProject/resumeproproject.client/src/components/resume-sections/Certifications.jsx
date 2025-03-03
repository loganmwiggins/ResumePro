import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { formatDate } from '../../utils/DateFormatter';
import '../../stylesheets/ResumeBuilder.css';

function Certifications({ data, handleChange, handleAddEntry, confirmRemoveEntry, handleChangeResumeData}) {
    const moveEntryUp = (index) => {
        if (index > 0) {
            const newData = [...data];
    
            // Swap entries
            [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
    
            // Ensure empty fields are reset to empty strings for the swapped entry
            Object.keys(newData[index]).forEach((key) => {
                if (!newData[index][key] && key != "expireDate") newData[index][key] = "";
            });
    
            Object.keys(newData[index - 1]).forEach((key) => {
                if (!newData[index - 1][key]  && key != "expireDate") newData[index - 1][key] = "";
            });
    
            // Fix Select options (handle undefined or empty values)
            newData.forEach((entry) => {
                if (!entry.jobType) entry.jobType = null;
                if (!entry.officeType) entry.officeType = null;
            });
    
            // Update order numbers (if necessary)
            newData.forEach((entry, idx) => (entry.orderNumber = idx + 1));
    
            // Trigger state update
            handleChangeResumeData("certifications", [...newData]);
        }
    };
    
    const moveEntryDown = (index) => {
        if (index < data.length - 1) {
            const newData = [...data];
    
            // Swap entries
            [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
    
            // Ensure empty fields are reset to empty strings for the swapped entry
            Object.keys(newData[index]).forEach((key) => {
                if (!newData[index][key]  && key != "expireDate") newData[index][key] = "";
            });
    
            Object.keys(newData[index + 1]).forEach((key) => {
                if (!newData[index + 1][key]  && key != "expireDate") newData[index + 1][key] = "";
            });
    
            // Fix Select options (handle undefined or empty values)
            newData.forEach((entry) => {
                if (!entry.jobType) entry.jobType = null;
                if (!entry.officeType) entry.officeType = null;
            });
    
            // Update order numbers (if necessary)
            newData.forEach((entry, idx) => (entry.orderNumber = idx + 1));
    
            // Trigger state update
            handleChangeResumeData("certifications", [...newData]);
        }
    };
    return (
        <section>
            <div className="section-head">
                <h3>Certifications</h3>
                <p>List any certifications that add credibility to your skills and make you stand out.</p>
            </div>

            <AnimatePresence>
                {data.map((cert, index) => (
                    // Individual certification entry
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
                                        {data[index].issuer || data[index].name
                                            ? `${data[index].issuer || data[index].name}${data[index].issuer && data[index].issuer ? " " + data[index].name : ""}`
                                            : "Untitled"}
                                    </h4>
                                    <p>
                                        {data[index].issueDate && `Issued: ${formatDate(data[index].issueDate)}`}
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
                                        <img src="/assets/icons/arrow-up.svg" draggable="false" className="icon-dynamic" />
                                    </button>
                                )}
                                {index <data.length -1 && (
                                    <button 
                                        type="button" 
                                        title="Move this entry down"
                                        onClick={() => moveEntryDown(index)}
                                    >
                                        <img src="/assets/icons/arrow-down.svg" draggable="false" className="icon-dynamic" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    title="Delete this entry"
                                    className="delete-btn"
                                    onClick={() => confirmRemoveEntry("certifications", index)}
                                >
                                    <img src="/assets/icons/trash.svg" draggable="false" className="icon-dynamic" />
                                </button>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="input-field">
                            <label>Name <span className="req">*</span></label>
                            <input 
                                type="text"
                                placeholder="Name of certification (e.g., Azure Fundamentals)"
                                onChange={(e) => handleChange("certifications", "name", e.target.value, index)}
                                value={data[index].name}
                            />
                        </div>
                        <div className="input-field">
                            <label>Issuer <span className="req">*</span></label>
                            <input 
                                type="text"
                                placeholder="Name of issuer (e.g., Microsoft)"
                                onChange={(e) => handleChange("certifications", "issuer", e.target.value, index)}
                                value={data[index].issuer}
                            />
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label>Issue Date <span className="req">*</span></label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange("certifications", "issueDate", e.target.value, index)} 
                                    value={data[index].issueDate || ""}
                                />
                            </div>
                            <div className="input-field">
                                <label>Expire Date</label>
                                <input 
                                    type="date" 
                                    min = {data[index].issueDate}
                                    onChange={(e) => handleChange("certifications", "expireDate", e.target.value, index)} 
                                    value={data[index].expireDate || ""}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Add Certification button */}
            <button 
                type="button" 
                className="add-entry-btn"
                onClick={() => handleAddEntry("certifications", {
                    name: null,
                    issuer: null,
                    issueDate: null,
                    expireDate: null,
                    orderNumber: data.length + 1
                })}
            >
                <img src="/assets/icons/plus-filled.svg" className="icon-dynamic" draggable="false" />
                <span>Add Certification</span>
            </button>
        </section>
    )
}

export default Certifications;