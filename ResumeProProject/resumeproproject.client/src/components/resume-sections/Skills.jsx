import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../stylesheets/ResumeBuilder.css';

function Skills({ data, handleReorderCategories, handleAddSkillCategory, handleRemoveSkillCategory, handleAddSkill, handleRemoveSkill }) {

    const moveCategoryUp = (index) => {
        const categories = Object.entries(data.skillsDataJson).map(([key, value]) => [String(key), value]); // Convert keys to strings
        if (index > 0) {
            [categories[index], categories[index - 1]] = [categories[index - 1], categories[index]];
            handleReorderCategories(Object.fromEntries(categories));
        }
    };

    const moveCategoryDown = (index) => {
        const categories = Object.entries(data.skillsDataJson).map(([key, value]) => [String(key), value]); // Convert keys to strings
        if (index < categories.length - 1) {
            [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
            handleReorderCategories(Object.fromEntries(categories));
        }
    };

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
                            e.preventDefault();
                            const category = document.getElementById("newCategoryInput").value;
                            if (category) {
                                handleAddSkillCategory(category);
                                document.getElementById("newCategoryInput").value = "";
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
                {Object.entries(data.skillsDataJson).map(([category, skills], index) => (
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
                            {/*<h4>{category.startsWith("Category_") ? category.substring(9) : category}</h4>*/}
                            <div className="entry-btns">
                                {/* Move Up Button */}
                                {index > 0 && (
                                    <button
                                        type="button"
                                        title="Move this category up"
                                        onClick={() => moveCategoryUp(index)}
                                    >
                                        <img src="/assets/icons/arrow-up.svg" className="icon-dynamic" draggable="false" />
                                    </button>
                                )}
                                {/* Move Down Button */}
                                {index < Object.keys(data.skillsDataJson).length - 1 && (
                                    <button
                                        type="button"
                                        title="Move this category down"
                                        onClick={() => moveCategoryDown(index)}
                                    >
                                        <img src="/assets/icons/arrow-down.svg" className="icon-dynamic" draggable="false" />
                                    </button>
                                )}
                                {/* Delete Category Button */}
                                <button
                                    type="button"
                                    title="Delete this category and its skills"
                                    className="delete-btn"
                                    onClick={() => handleRemoveSkillCategory(category)}
                                >
                                    <img src="/assets/icons/trash.svg" className="icon-dynamic" />
                                </button>
                            </div>
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
                                            title={`Remove ${skill}`}
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
                                            e.preventDefault();
                                            let skill = document.getElementById(`skillInput-${category}`).value;
                                            skill = String(skill);
                                            if (skill.trim() !== "") {
                                                handleAddSkill(category, skill);
                                                document.getElementById(`skillInput-${category}`).value = "";
                                            }
                                        }
                                    }}
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        let skill = document.getElementById(`skillInput-${category}`).value;
                                        skill = String(skill);
                                        if (skill.trim() !== "") {
                                            handleAddSkill(category, skill);
                                            document.getElementById(`skillInput-${category}`).value = "";
                                        }
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <img src="/assets/icons/plus.svg" className="icon-dynamic" draggable="false" />
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