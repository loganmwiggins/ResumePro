import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import AuthorizeView from '../components/AuthorizeView';
import { showToast } from '../utils/Toast';
import { templates } from '../utils/TemplateList';
import '../stylesheets/templateselection.css';

function TemplateSelection() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [layout, setLayout] = useState("grid");

  const handleWheel = () => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft += event.deltaY;  // Move horizontally
  };

  const handleTemplateSelect = (templateId, templateName) => {
    navigate(`/builder/${templateId}`);
    showToast(`Let's get started with the '${templateName}' template.`, "info", "Great choice!");
  }

  return (
    <AuthorizeView>
      {/* Header */}
      <div className="multi-header">
        <div className="page-header">
          <h1>Choose a Template</h1>
          <p>Let's get started! Pick a template to start editing.</p>
        </div>
        <div className="switcher">
          <button 
            type="button" 
            className={`switch ${layout === "grid" ? "switch-active" : ""}`}
            onClick={() => setLayout("grid")}
          >
            <img src="/assets/icons/rectangle-grid.svg" className="icon-dynamic" draggable="false" />
          </button>
          <button 
            type="button" 
            className={`switch ${layout === "full" ? "switch-active" : ""}`}
            onClick={() => setLayout("full")}
          >
            <img src="/assets/icons/rectangle-vertical.svg" className="icon-dynamic" draggable="false" />
          </button>
        </div>
      </div>

      <motion.div
        className="templates-row"
        key={layout}
        ref={scrollContainerRef}
        onWheel={layout === "full" ? handleWheel : null}
        style={layout === "grid" ? {flexFlow: "wrap", padding: "0 0 4rem 0"} : {overflowX: "scroll", padding: "1rem 1rem 3rem 1rem"}}
      >
        {templates.map((template, index) => (  // Dynamically populated from TemplateList.jsx
          <div 
            key={index}
            className="template" 
            style={{ animationDelay: `${index * 0.2}s`}}
            onClick={() => handleTemplateSelect(`${template.id}`, `${template.name}`)}
          >
            <div 
              className="template-img"
              style={layout === "grid" ? {width: "18rem", height: "24rem"} : {width: "24rem", height: "32rem"}}
            >
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
      </motion.div>
    </AuthorizeView>
  );
}

export default TemplateSelection;