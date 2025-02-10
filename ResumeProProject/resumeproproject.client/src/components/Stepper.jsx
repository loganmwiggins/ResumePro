import React from "react";
import "../stylesheets/Stepper.css";

const steps = ["General Info", "Experience", "Education", "Certifications", "Projects", "Skills"];

function Stepper({ currentStep, setCurrentStep }) {
  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${currentStep === index ? "step-active" : ""}`}
          onClick={() => setCurrentStep(index)}
        >
          {step}
        </div>
      ))}
    </div>
  );
}

export default Stepper;