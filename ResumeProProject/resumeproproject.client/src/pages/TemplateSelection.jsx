import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/TemplateSelection.css';
import AuthorizeView from '../components/AuthorizeView';
import { showToast } from '../utils/Toast';

function TemplateSelection() {
    const navigate = useNavigate();

    const handleTemplateSelect = (templateId) => {
        navigate(`/builder/${templateId}`);
        showToast(`Let's get started with the ${templateId} template.`, "info", "Great choice!");
    };

    return (
        <AuthorizeView>
            <div className="page-header">
                <h1>Choose a Template</h1>
                <p>Let's get started! Click on a template to start editing.</p>
            </div>

            <div className="templates-row">
                {/* Minimal Template */}
                <div className="template" onClick={() => handleTemplateSelect("minimal")}>
                    <div className="template-img">
                        <img src="/assets/template-thumbnails/minimal-thumbnail.png" alt="Minimal Template" draggable="false" />
                    </div>
                    <div className="template-info">
                        <div className="template-txt">
                            <p>Minimal</p>
                            <p>A simple and easy resume that promotes professionalism</p>
                        </div>
                    </div>
                </div>

                {/* Classic Template */}
                <div className="template" onClick={() => handleTemplateSelect("classic")}>
                    <div className="template-img">
                        <img src="/assets/template-thumbnails/classic-thumbnail.png" alt="Classic Clean Template" draggable="false" />
                    </div>
                    <div className="template-info">
                        <div className="template-txt">
                            <p>Classic</p>
                            <p>A modern and structured layout with a clean design</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthorizeView>
    );
}

export default TemplateSelection;
