import React from "react";
import '../../stylesheets/ResumeBuilder.css';

function Skills({ data, handleAddSkillCategory, handleRemoveSkillCategory, handleAddSkill, handleRemoveSkill }) {
    return (
        <section>
            <div className="section-head">
                <h3>Skills</h3>
                <p>Highlight your key technical and soft skills that are relevant to your industry and role. Help employers quickly understand your strengths.</p>
            </div>

            {/* Add new category */}
            <div className="input-field">
                <div className="skill-header">
                    <label>New Skill Category</label>
                </div>
                <input type="text" id="newCategoryInput" />
                <button
                    type="button"
                    onClick={() => {
                        const category = document.getElementById("newCategoryInput").value;
                        if (category) {
                            handleAddSkillCategory(category);
                            document.getElementById("newCategoryInput").value = "";
                        }
                    }}
                >
                    Add Category
                </button>
            </div>

            {/* List Existing Skill Categories */}
            {Object.entries(data.skillsDataJson).map(([category, skills]) => (
                <div key={category} className="skill-category">
                    <div className="skill-header">
                        <h4>{category}</h4>
                        {/* DELETE CATEGORY BUTTON */}
                        <button type="button" className="delete-btn" onClick={() => handleRemoveSkillCategory(category)}>
                            <img src="/assets/icons/trash.svg" alt="Delete" className="trash-icon" />
                        </button>
                    </div>

                    {/* Add Skill Input */}
                    <div className="input-field">
                        <input type="text" id={`skillInput-${category}`} />
                        <button
                            type="button"
                            onClick={() => {
                                const skill = document.getElementById(`skillInput-${category}`).value;
                                if (skill) {
                                    handleAddSkill(category, skill);
                                    document.getElementById(`skillInput-${category}`).value = "";
                                }
                            }}
                        >
                            Add Skill
                        </button>
                    </div>

                    {/* Display Skills in Each Category */}
                    <ul>
                        {[...skills].map((skill) => (
                            <li key={skill}>
                                {skill}
                                {/* DELETE INDIVIDUAL SKILL BUTTON */}
                                <button className="delete-x-btn" onClick={() => handleRemoveSkill(category, skill)}>
                                    &#128939;
                                </button>

                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}

export default Skills;