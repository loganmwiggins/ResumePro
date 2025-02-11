import React from 'react';
import '../../stylesheets/ResumeBuilder.css';


function Projects({ data, handleChange, handleAddEntry, handleRemoveEntry}) {
    return (
        <section>
            <div className="section-head">
                <h3>Projects</h3>
                <p>Showcase notable projects you have worked on, including personal, academic, or professional projects. Highlight key achievements and technologies used.</p>
            </div>

            {/* Project entry */}
            {data.map((proj, index) => (
                <div className="inputs-ctnr" key={index}>
                    <h4>#{index + 1}</h4>
                    <button type="button" className="delete-btn" onClick={() => handleRemoveEntry("projects", index)}>
                        <img src="/assets/icons/trash.svg" alt="Delete" className="trash-icon" />
                    </button>

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
                            onChange={(e) => handleChange("projects", "endDate", e.target.value, index)} 
                            value={data[index].endDate}
                        />
                    </div>
                    <div className="input-field">
                        <label>Description <span className="req">*</span></label>
                        <input 
                            type="textarea"
                            placeholder="What did you do?"
                            onChange={(e) => handleChange("projects", "description", e.target.value, index)}
                            value={data[index].description}
                        />
                    </div>
                </div>
            ))}

            {/* Add Project button */}
            <button 
                type="button"
                className="add-entry-btn"
                onClick={() => handleAddEntry("projects", {
                    title: null,
                    description: null,
                    startDate: null,
                    endDate: null
                })}
            >
                <img src="/assets/icons/plus-filled.svg" draggable="false" />
                <span>Add Project</span>
            </button>
        </section>
    );
}

export default Projects;