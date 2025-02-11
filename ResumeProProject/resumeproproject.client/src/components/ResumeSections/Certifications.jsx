import React from 'react';
import '../../stylesheets/ResumeBuilder.css';


function Certifications({ data, handleChange, handleAddEntry, handleRemoveEntry}) {
    return (
        <section>
            <div className="section-head">
                <h3>Certifications</h3>
                <p>List any certifications that add credibility to your skills and make you stand out.</p>
            </div>

            {/* Certification entry */}
            {data.map((cert, index) => (
                <div className="inputs-ctnr" key={index}>
                    <h4>#{index + 1} - {data[index].name}</h4>
                    <button type="button" className="delete-btn" onClick={() => handleRemoveEntry("certifications", index)}>
                        <img src="/assets/icons/trash.svg" alt="Delete" className="trash-icon" />
                    </button>

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
            ))}

            {/* Add Certification button */}
            <button 
                type="button" 
                className="add-entry-btn"
                onClick={() => handleAddEntry("certifications", {
                    name: null,
                    issuer: null,
                    issueDate: null,
                    expireDate: null
                })}
            >
                <img src="/assets/icons/plus-filled.svg" draggable="false" />
                <span>Add Certification</span>
            </button>
        </section>
    )
}

export default Certifications;