import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { formatDate } from '../../utils/DateFormatter';
import '../../stylesheets/ResumeBuilder.css';

function Certifications({ data, handleChange, handleAddEntry, handleRemoveEntry}) {
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
                            <button type="button" className="delete-btn" onClick={() => handleRemoveEntry("certifications", index)}>
                                <img src="/assets/icons/trash.svg" alt="Delete" className="trash-icon" />
                            </button>
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
                                    value={data[index].issueDate}
                                />
                            </div>
                            <div className="input-field">
                                <label>Expire Date</label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange("certifications", "expireDate", e.target.value, index)} 
                                    value={data[index].expireDate}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Add Certification button */}
            <motion.button 
                type="button" 
                className="add-entry-btn"
                onClick={() => handleAddEntry("certifications", {
                    name: null,
                    issuer: null,
                    issueDate: null,
                    expireDate: null
                })}
                whileTap={{ scale: 0.9 }}
            >
                <img src="/assets/icons/plus-filled.svg" draggable="false" />
                <span>Add Certification</span>
            </motion.button>
        </section>
    )
}

export default Certifications;