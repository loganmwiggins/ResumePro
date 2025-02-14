import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/TemplateSelection.css';
import AuthorizeView from '../components/AuthorizeView';
import { showToast } from '../utils/Toast';

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
        <p>Let's get started! Click on a template to start editing.</p>
      </div>

      <div className="templates-row">
        {/* Minimal template */}
        <div className="template" onClick={() => handleTemplateSelect("minimal", "Minimal")}>
          <div className="template-img">
            <img src="/assets/template-thumbnails/minimal-thumbnail.png" draggable="false" />
          </div>
          <div className="template-info">
            <div className="template-txt">
              <p>Minimal</p>
              <p>A simple and easy resume that promotes professionalism</p>
            </div>
          </div>
        </div>

        {/* Bold Navy template */}
        <div className="template" onClick={() => handleTemplateSelect("bold navy", "Bold Navy")}>
          <div className="template-img">
            <img src="/assets/template-thumbnails/boldNavy-thumbnail.png" draggable="false" />
          </div>
          <div className="template-info">
            <div className="template-txt">
              <p>Bold Navy</p>
              <p>A bold navy blue based template with solid colors and capitalization</p>
            </div>
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
}

export default TemplateSelection;