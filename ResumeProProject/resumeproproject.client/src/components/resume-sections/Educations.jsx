import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { formatDate } from '../../utils/DateFormatter';
import '../../stylesheets/ResumeBuilder.css';

function Educations({ data, handleChange, handleAddEntry, handleRemoveEntry,handleChangeResumeData}) {

    // const swapAttributes = (entryA, entryB) => {
    //     Object.keys(entryA).forEach((key) => {
    //         console.log("-------------------------------------")
    //         console.log(key + "  ENTRY A KEY: " + entryA[key])
    //         console.log(key + "  ENTRY B KEY: " + entryB[key])
    //         let temp = entryA[key];
    //         entryA[key] = entryB[key];
    //         entryB[key] = temp;
    //         console.log(key + "  AFTER SWAP ENTRY A KEY : " + entryA[key])
    //         console.log(key + "  AFTER SWAP ENTRY B KEY: " + entryB[key])
    //     });
    // };
    
    // const moveEntryUp = (index) => {
    //     if (index > 0) {
    //         const newData = [...data];
            
    
    //         // Swap attributes instead of objects
    //         swapAttributes(newData[index], newData[index - 1]);
    
    //         // Update order numbers
    //         newData.forEach((entry, idx) => (entry.orderNumber = idx + 1));
    
    //         handleChangeResumeData("educations", [...newData]);
    //     }
    // };
    
    // const moveEntryDown = (index) => {
    //     if (index < data.length - 1) {
    //         const newData = [...data];
    
    //         // Swap attributes instead of objects
    //         swapAttributes(newData[index], newData[index + 1]);
    
    //         // Update order numbers
    //         newData.forEach((entry, idx) => (entry.orderNumber = idx + 1));
    
    //         handleChangeResumeData("educations", [...newData]);
    //     }
    // };
    const moveEntryUp = (index) => {
        if (index > 0) {
            const newData = [...data];
    
            // Swap entries
            [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
    
            // Ensure empty fields are reset to empty strings for the swapped entry
            Object.keys(newData[index]).forEach((key) => {
                // console.log("KEY VAL" + key.value);
                 if(key === "gpa" && isNaN(Number.parseFloat(newData[index][key]))){console.log("GPA IS:    " + newData[index][key])}
                if(newData[index][key] === null){
                    console.log("gpa is null so we're in here")
                    return;
                } else if(key === "gpa" && isNaN(Number.parseFloat(newData[index][key]))){
                    console.log("UP IM HERE selected");
                    newData[index][key] = null; // Set GPA to null if it's undefined
                    // console.log(newData[index][key])
                    return;
                }
                if (!newData[index][key]) newData[index][key] = "";
              //  console.log("KEY NAME:  " + key + "  " + "|" + newData[index][key] + "|");
                // console.log(newData[index][key])
            });
    
            Object.keys(newData[index - 1]).forEach((key) => {
                if(newData[index-1][key] === null){
                    return;
                }else if(key === "gpa" && isNaN(Number.parseFloat(newData[index-1][key]))){
                    console.log("UP IM HERE below");
                    newData[index-1][key] = null; // Set GPA to null if it's undefined
                    console.log(newData[index][key])
                    return;
                }
                if (!newData[index - 1][key]) newData[index - 1][key] = "";
            });

    
            // Update order numbers (if necessary)
            newData.forEach((entry, idx) => (entry.orderNumber = idx + 1));
    
            // Trigger state update
            handleChangeResumeData("educations", [...newData]);
        }
    };
    
    const moveEntryDown = (index) => {
        if (index < data.length - 1) {
            const newData = [...data];
    
            // Swap entries
            [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
    
            // Ensure empty fields are reset to empty strings for the swapped entry
            Object.keys(newData[index]).forEach((key) => {
                if(newData[index][key] === null){
                    console.log("gpa is null so we're in here")
                    return;
                }
                else if(key === "gpa" && isNaN(Number.parseFloat(newData[index][key]))){
                    console.log(" DOWN IM HERE selected");
                    newData[index][key] = null; // Set GPA to null if it's undefined
                    console.log(newData[index][key])
                    return;
                }
                if (!newData[index][key]) newData[index][key] = "";
            });
    
            Object.keys(newData[index + 1]).forEach((key) => {
                if(newData[index + 1][key] === null){
                    console.log("gpa is null so we're in here")
                    return;
                }
                else if(key === "gpa" && isNaN(Number.parseFloat(newData[index + 1][key]))){
                    console.log("DOWN IM HERE above");
                    newData[index + 1][key] = null; // Set GPA to null if it's undefined
                    console.log(newData[index][key])
                    return;
                }
                if (!newData[index + 1][key]) newData[index + 1][key] = "";
            });
    
            // Fix Select options (handle undefined or empty values)
            newData.forEach((entry) => {
                if (!entry.jobType) entry.jobType = null;
                if (!entry.officeType) entry.officeType = null;
            });
    
            // Update order numbers (if necessary)
            newData.forEach((entry, idx) => (entry.orderNumber = idx + 1));
    
            // Trigger state update
            handleChangeResumeData("educations", [...newData]);
        }
    };
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
                            {/* Entry info */}
                            <div className="entry-info">
                                <div className="entry-icon">{index + 1}</div>
                                <div className="entry-info-txt">
                                    <h4>{data[index].schoolName || "Untitled"}</h4>
                                    {data[index].startDate && formatDate(data[index].startDate, {month: true, year: true}) || "Start"} - {data[index].endDate && formatDate(data[index].endDate, {month: true, year: true}) || "End"}
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
                                    onClick={() => handleRemoveEntry("educations", index)}
                                >
                                    <img src="/assets/icons/trash.svg" draggable="false" className="icon-dynamic" />
                                </button>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="input-row">
                            <div className="input-field">
                                <label>Degree Type <span className="req">*</span></label>
                                <input 
                                    type="text"
                                    placeholder="(e.g., Bachelor of Science)"
                                    onChange={(e) => handleChange("educations", "degreeType", e.target.value, index)}
                                    value={data[index]?.degreeType ?? ""}
                                />
                            </div>
                            <div className="input-field">
                                <label>Major <span className="req">*</span></label>
                                <input 
                                    type="text"
                                    placeholder="(e.g.,  Finance, Computer Science)"
                                    onChange={(e) => handleChange("educations", "major", e.target.value, index)}
                                    value={data[index]?.major ?? ""}
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
                                    value={data[index]?.minor ?? ""}
                                />
                            </div>
                            <div className="input-field">
                                <label>GPA</label>
                                <input 
                                    type="number"
                                    placeholder="Typically only include if above 3.0"
                                    min={0.0}
                                    max={4.0}
                                    step="0.01"
                                    onChange={(e) => {
                                        console.log(e.target.value)
                                        if(e.target.value === "" || null || undefined){
                                            handleChange("educations","gpa",null,index)
                                        }else{
                                        const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                        handleChange("educations", "gpa", value, index);
                                        }
                                    }}
                                    value={data[index].gpa === null ? "" : data[index].gpa}
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label>School / University <span className="req">*</span></label>
                                <input 
                                    type="text"
                                    placeholder="(e.g.,  Florida State University)"
                                    onChange={(e) => handleChange("educations", "schoolName", e.target.value, index)}
                                    value={data[index]?.schoolName ?? ""}
                                />
                            </div>
                            <div className="input-field">
                                <label>Location</label>
                                <input 
                                    type="text"
                                    placeholder="(e.g.,  Manhattan, NY)"
                                    onChange={(e) => handleChange("educations", "schoolLocation", e.target.value, index)}
                                    value={data[index]?.schoolLocation ?? ""}
                                />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label>Start Date <span className="req">*</span></label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange("educations", "startDate", e.target.value, index)} 
                                    value={data[index].startDate || ""}
                                />
                            </div>
                            <div className="input-field">
                                <label>End Date <span className="req">*</span></label>
                                <input 
                                    type="date" 
                                    min = {data[index].startDate}
                                    onChange={(e) => handleChange("educations", "endDate", e.target.value, index)} 
                                    value={data[index].endDate || ""}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Add Education button */}
            <button 
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
                    orderNumber: data.length + 1
                })}
            >
                <img src="/assets/icons/plus-filled.svg" className="icon-dynamic" draggable="false" />
                <span>Add Education</span>
            </button>
        </section>
    );
}

export default Educations;