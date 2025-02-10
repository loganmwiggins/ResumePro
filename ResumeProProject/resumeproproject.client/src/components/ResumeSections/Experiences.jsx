import React from 'react';
import Select from "react-select";
import '../../stylesheets/ResumeBuilder.css';


function Experiences({ data, handleChange, handleAddEntry, handleRemoveEntry}) {

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
            <h3>Experience</h3>

            {/* Individual experience entry */}
            {data.map((exp, index) => (
                <div className="inputs-ctnr" key={index}>
                    <h4>#{index + 1} - {data[index].companyName}</h4>
                    <button type="button" className="delete-btn" onClick={() => handleRemoveEntry("experiences", index)}>
                        <img src="/assets/icons/trash.svg" alt="Delete" className="trash-icon" />
                    </button>

                    <div className="input-field">
                        <label>Company / Employer <span className="req">*</span></label>
                        <input
                            type="text"
                            onChange={(e) => handleChange("experiences", "companyName", e.target.value, index)}
                            value={data[index].companyName}
                        />
                    </div>
                    <div className="input-field">
                        <label>Role <span className="req">*</span></label>
                        <input
                            type="text"
                            onChange={(e) => handleChange("experiences", "role", e.target.value, index)}
                            value={data[index].role}
                        />
                    </div>
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
                    <div className="input-field">
                        <label>Description <span className="req">*</span></label>
                        <input 
                            type="textarea" 
                            onChange={(e) => handleChange("experiences", "description", e.target.value, index)}
                            value={data[index].description}
                        />
                    </div>
                    <div className="input-field">
                        <label>Location</label>
                        <input 
                            type="text" 
                            onChange={(e) => handleChange("experiences", "location", e.target.value, index)} 
                            value={data[index].location}
                        />
                    </div>
                </div>
            ))}
            
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