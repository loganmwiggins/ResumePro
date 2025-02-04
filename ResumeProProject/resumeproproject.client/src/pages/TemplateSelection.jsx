import React from 'react';

import '../stylesheets/TemplateSelection.css';
import AuthorizeView from '../components/AuthorizeView';

function TemplateSelection() {
  return (
    <AuthorizeView>
      <div className="page-header">
        <h1>Choose a Template</h1>
        <p>Let's get started!</p>
      </div>
    </AuthorizeView>
  )
}

export default TemplateSelection;