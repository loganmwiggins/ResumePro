import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/TemplateSelection.css';
import AuthorizeView from '../components/AuthorizeView';
import { showToast } from '../utils/Toast';

function TemplateSelection() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const getAllTemplates = async () => {
      try {
        const response = await fetch("https://localhost:7035/api/Template/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setTemplates(data); // Store fetched templates in state
          // showToast("Templates retrieved successfully.", "success");
        } else {
          showToast("Failed to fetch templates.", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showToast("An error occurred.", "error");
      }
    };

    getAllTemplates();
  }, []);

  const handleTemplateSelect = (templateId) => {
    navigate(`/builder/${templateId}`);
    // showToast(templateId, "info");
  }

  return (
    <AuthorizeView>
      <div className="page-header">
        <h1>Choose a Template</h1>
        <p>Let's get started!</p>
      </div>

      <div className="template-list">
        {templates.length > 0 ? (
          templates.map((template, index) => (
            <div key={index} className="template-item" onClick={() => handleTemplateSelect(template.templateId)}>
              <h2>{template.name}</h2>
              <iframe 
                title={template.name} 
                srcDoc={template.content} 
                width= "425px"
                height= "550px"
                className="template-preview"
              />
            </div>
          ))
        ) : (
          <p>Loading templates...</p>
        )}
      </div>
    </AuthorizeView>
  );
}

export default TemplateSelection;
