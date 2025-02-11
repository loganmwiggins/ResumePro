import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import '../../stylesheets/ResumeBuilder.css';

function Skills({ data, handleAddSkillCategory, handleRemoveSkillCategory, handleAddSkill, handleRemoveSkill }) {
    return (
        <section>
            <div className="section-head">
                <h3>Skills</h3>
                <p>Highlight your key technical and soft skills that are relevant to your industry and role. Help employers quickly understand your strengths.</p>
            </div>

            {/* Add new category */}
            <div className="new-category-ctnr">
                <input 
                    type="text" 
                    placeholder="New Skill Category"
                    id="newCategoryInput"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();  // Prevent form submission
                            const category = document.getElementById("newCategoryInput").value;
                            if (category) {
                                handleAddSkillCategory(category);
                                document.getElementById("newCategoryInput").value = "";  // Clear the input
                            }
                        }
                    }}
                />
                <motion.button
                    type="button"
                    className="btn btn-black"
                    onClick={() => {
                        const category = document.getElementById("newCategoryInput").value;
                        if (category) {
                            handleAddSkillCategory(category);
                            document.getElementById("newCategoryInput").value = "";
                        }
                    }}
                    whileTap={{ scale: 0.9 }}
                >
                    <span>Add</span>
                </motion.button>
            </div>

            {/* List Existing Skill Categories */}
            <AnimatePresence>
                {Object.entries(data.skillsDataJson).map(([category, skills]) => (
                    <motion.div 
                        key={category} 
                        className="skill-category-ctnr"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        layout
                    >
                        <div className="skill-category-header">
                            <h4>{category}</h4>
                            {/* DELETE CATEGORY BUTTON */}
                            <button 
                                type="button" 
                                className="delete-btn" 
                                onClick={() => handleRemoveSkillCategory(category)}
                            >
                                <img src="/assets/icons/trash.svg" alt="Delete" className="trash-icon" />
                            </button>
                        </div>

                        {/* Display Skills in Each Category */}
                        <div className="skills-ctnr">
                            <AnimatePresence>
                                {[...skills].map((skill) => (
                                    <motion.div 
                                        key={skill} 
                                        className="skill"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                                    >
                                        <span>{skill}</span>
                                        {/* Delete individual skill button */}
                                        <button 
                                            type="button"
                                            className="delete-x-btn" 
                                            onClick={() => handleRemoveSkill(category, skill)}
                                        >
                                            &#128939;
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {/* Add Skills input */}
                            <div className="skill-input-ctnr">
                                <input 
                                    type="text" 
                                    placeholder="Add skills"
                                    className="skill-input" 
                                    id={`skillInput-${category}`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();  // Prevent form submission
                                            const skill = document.getElementById(`skillInput-${category}`).value;
                                            if (skill) {
                                                handleAddSkill(category, skill);
                                                document.getElementById(`skillInput-${category}`).value = "";  // Clear the input
                                            }
                                        }
                                    }}
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        const skill = document.getElementById(`skillInput-${category}`).value;
                                        if (skill) {
                                            handleAddSkill(category, skill);
                                            document.getElementById(`skillInput-${category}`).value = "";
                                        }
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <img src="/assets/icons/plus.svg" draggable="false" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </section>
    );
}

export default Skills;