import React from 'react';
import Template_Minimal from './Template_Minimal';

function AllTemplates({ selectedTemplate, resumeData }) { // Planning to possibly include condition to change resume template on the resume builder page
  // We can add more templates here as we create them
  const templates = [
    { id: "minimal", name: "Minimal", component: Template_Minimal }
  ];

  const selectedTemplateObj = templates.find(template => template.id === selectedTemplate);

  // Original template size
  const originalWidth = 850;
  const originalHeight = 1100;

  // Target container size
  const containerWidth = 500;
  const containerHeight =  619;

  // Compute the scale factor while maintaining aspect ratio
  const scale = Math.min(containerWidth / originalWidth, containerHeight / originalHeight);

  return (
    <div className="resume-scale-ctnr" style={{ 
        transform: `scale(${scale})`, 
        transformOrigin: "top left",
        // width: `${originalWidth}px`,
        // height: `${originalHeight}px`
    }}>
        <selectedTemplateObj.component resumeData={resumeData} />
    </div>
  );
}

export default AllTemplates;