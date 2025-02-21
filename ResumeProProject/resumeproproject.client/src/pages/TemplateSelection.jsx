import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/TemplateSelection.css';
import AuthorizeView from '../components/AuthorizeView';
import { showToast } from '../utils/Toast';
import { templates } from '../utils/TemplateList';

function TemplateSelection() {
  const navigate = useNavigate();

  const handleTemplateSelect = (templateId, templateName) => {
    navigate(`/builder/${templateId}`);
    showToast(`Let's get started with the '${templateName}' template.`, "info", "Great choice!");
  }

  return (
    <AuthorizeView>
      <div className="page-header">
        <h1>Choose a Template</h1>
        <p>Let's get started! Pick a template to start editing.</p>
      </div>

      <div className="templates-row">
        {/* Dynamically populated from TemplateList.jsx */}
        {templates.map((template, index) => (
          <div 
            key={index}
            className="template" 
            style={{ animationDelay: `${index * 0.2}s`}}
            onClick={() => handleTemplateSelect(`${template.id}`, `${template.name}`)}
          >
            <div className="template-img">
              <img src={template.imgPath} draggable="false" />
            </div>
            <div className="template-info">
              <div className="template-txt">
                <p>{template.name}</p>
                <p>{template.tagline}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AuthorizeView>
  );
}

export default TemplateSelection;