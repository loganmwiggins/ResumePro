import React from 'react';
import { templates } from '../../utils/TemplateList';   // Update this file to add a new template

function AllTemplates({ selectedTemplate, resumeData, viewMode }) {

    const selectedTemplateObj = templates.find(template => template.id === selectedTemplate);

    if (!selectedTemplateObj) {
        return <div>Error: Template not found</div>;
    }

    // Scaling styles
    let scaleStyle = {}; // Default styling (used for preview mode)

    if (viewMode === "builder") {
        // Original template size
        const originalWidth = 850;
        const originalHeight = 1100;

        // Target container size
        const containerWidth = 500;
        const containerHeight = 619;

        // Compute the scale factor while maintaining aspect ratio
        const scale = Math.min(containerWidth / originalWidth, containerHeight / originalHeight);

        scaleStyle = {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
        };
    } 
    else if (viewMode === "preview") {
        scaleStyle = {
            transform: "none",
            width: "100%",
            height: "100%",
        };
    }

    return (
        <div className="resume-scale-ctnr" style={scaleStyle}>
            <selectedTemplateObj.component data={resumeData} />
        </div>
    );
}

export default AllTemplates;