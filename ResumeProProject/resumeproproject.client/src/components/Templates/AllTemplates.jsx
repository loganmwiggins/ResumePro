import React, { useState, useEffect, useRef } from 'react';
import { templates } from '../../utils/TemplateList';

function AllTemplates({ selectedTemplate, resumeData, color, textSize }) {
    const selectedTemplateObj = templates.find(template => template.id === selectedTemplate);
    const resumeContainerRef = useRef(null);
    const [scale, setScale] = useState(1);

    if (!selectedTemplateObj) {
        return <div>Error: Template not found</div>;
    }

    useEffect(() => {
        const updateScale = () => {
            if (resumeContainerRef.current) {
                const parentWidth = resumeContainerRef.current.parentElement.offsetWidth;
                const parentHeight = resumeContainerRef.current.parentElement.offsetHeight;

                const originalWidth = 800; // Original template width
                const originalHeight = 1100; // Original template height

                // Compute the scale factor while maintaining aspect ratio
                const scaleFactor = Math.min(parentWidth / originalWidth, parentHeight / originalHeight);

                // Ensure the scale updates dynamically
                setScale(scaleFactor);
            }
        };

        // Run on mount and on resize
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    let scaleStyle = {
        transform: `scale(${scale})`,
        position: "center",
    };

    return (
        <div ref={resumeContainerRef} className="resume-scale-ctnr" style={scaleStyle}>
            <selectedTemplateObj.component 
                data={resumeData}
                color={color}
                textSize={textSize}
            />
        </div>
    );
}

export default AllTemplates;