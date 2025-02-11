import React from 'react';
import '../../stylesheets/ResumeBuilder.css';

function Educations({ data, handleChange, handleAddEntry, handleRemoveEntry}) {
    return (
        <section>
            <div className="section-head">
                <h3>Education</h3>
                <p>Include your academic background to demonstrate your qualifications and expertise. Generally, only degrees from universities or colleges are listed.</p>
            </div>

            {/* Education entry */}
            {data.map((edu, index) => (
                <div className="inputs-ctnr" key={index}>
                    <h4>#{index + 1}</h4>
                    <button type="button" className="delete-btn" onClick={() => handleRemoveEntry("educations", index)}>
                        <img src="/assets/icons/trash.svg" draggable="false" className="trash-icon" />
                    </button>

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
                            placeholder="(e.g., Finance, Computer Science, Economics)"
                            onChange={(e) => handleChange("educations", "major", e.target.value, index)}
                            value={data[index].major}
                        />
                    </div>
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
                        <label>School / University <span className="req">*</span></label>
                        <input 
                            type="text"
                            onChange={(e) => handleChange("educations", "schoolName", e.target.value, index)}
                            value={data[index].schoolName}
                        />
                    </div>
                    <div className="input-field">
                        <label>Location</label>
                        <input 
                            type="text"
                            onChange={(e) => handleChange("educations", "schoolLocation", e.target.value, index)}
                            value={data[index].schoolLocation}
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
            ))}

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
                })}
            >
                <img src="/assets/icons/plus-filled.svg" draggable="false" />
                <span>Add Education</span>
            </button>
        </section>
    );
}

export default Educations;