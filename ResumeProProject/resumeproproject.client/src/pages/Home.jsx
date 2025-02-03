import React from 'react';

import '../stylesheets/Home.css';
import AuthorizeView from '../components/AuthorizeView';
import { showToast } from '../utils/Toast';

function Home() {
  const toastSuccess = () => {
    showToast("This is a toast message.", "success", "Success!");
  }
  const toastError = () => {
    showToast("This is a toast message.", "error", "Error");
  }
  const toastWarning = () => {
    showToast("This is a toast message.", "warning", "Warning");
  }
  const toastInfo = () => {
    showToast("This is a toast message.", "info");
  }

  return (
    <AuthorizeView>    
      <div>Home page</div>
      <br />
      <div className="temp">
        <button onClick={toastSuccess}>Success</button>
        <button onClick={toastError}>Error</button>
        <button onClick={toastWarning}>Warning</button>
        <button onClick={toastInfo}>Info</button>
      </div>
    </AuthorizeView>
  )
}

export default Home;