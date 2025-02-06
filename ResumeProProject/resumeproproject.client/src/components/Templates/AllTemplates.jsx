import React from 'react';
import Template_Minimal from './Template_Minimal';

function AllTemplates({ selectedTemplate, resumeData }) { // Planning to possibly include condition to change resume template on the resume builder page
  // We can add more templates here as we create them
  const templates = [
    { id: "minimal", name: "Minimal", component: Template_Minimal }
  ];

  // Find template -- not sure if we are doing it by id still?
  const selectedTemplateObj = templates.find(template => template.id === selectedTemplate);

  return (
    <div className="template-list"> 
        <div className="template-item">
            <div className="template-preview">
                <selectedTemplateObj.component resumeData={resumeData} />
            </div>
        </div>
    </div>
  );
}

export default AllTemplates;