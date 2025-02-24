import React, { useState, useEffect, useRef } from 'react';
import { templates } from '../../utils/TemplateList';

function AllTemplates({ selectedTemplate, resumeData, viewMode }) {
    const selectedTemplateObj = templates.find(template => template.id === selectedTemplate);
    const resumeContainerRef = useRef(null);
    const [scale, setScale] = useState(1);

    if (!selectedTemplateObj) {
        return <div>Error: Template not found</div>;
    }

    useEffect(() => {
        if (viewMode === "builder") {
            const updateScale = () => {
                if (resumeContainerRef.current) {
                    const parentWidth = resumeContainerRef.current.parentElement.offsetWidth;
                    const parentHeight = resumeContainerRef.current.parentElement.offsetHeight;

                    const originalWidth = 800;// Original template width
                    const originalHeight = 1100; // Original template height

                    // Compute the scale factor while maintaining aspect ratio
                    const scaleFactor = Math.min(parentWidth / originalWidth, parentHeight / originalHeight);

                    // Ensure the scale updates dynamically for both smaller and larger screens
                    setScale(scaleFactor);
                   //onsole.log(scaleFactor);
                }
            };

            // Run on mount and on resize
            updateScale();
            window.addEventListener("resize", updateScale);
            return () => window.removeEventListener("resize", updateScale);
        }
    }, [viewMode]);

    // Define scale styles based on view mode
    let scaleStyle = {};
    let outsideStyle = {};

    if (viewMode === "builder") {
        scaleStyle = {
            transform: `scale(${scale})`,
            //transformOrigin: "top left",
            position: "center",
            //boxShadow: "0 0 .25rem rgba(0, 0, 0, .25)"
        };
        outsideStyle = {
            transform: "none",
            width: "100%",
            height: "100%",
        }
    } else if (viewMode === "preview") {
        scaleStyle = {
            transform: "none",
            width: "100%",
            height: "100%",
        };
    }
    //return (
    //    <div className="resume-scale-ctnr" style={scaleStyle}>
    //        <selectedTemplateObj.component data={resumeData} />
    //    </div>
    //);
    return (
        //<div className="sos" style={outsideStyle}>
            <div ref={viewMode === "builder" ? resumeContainerRef : null} className="resume-scale-ctnr" style={scaleStyle}>
                <selectedTemplateObj.component data={resumeData} />
            </div>
            //</div>
    );
}

export default AllTemplates;