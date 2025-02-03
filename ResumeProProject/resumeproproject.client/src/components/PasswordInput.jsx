import React, { useState } from "react";

const PasswordInput = ({ id, name, placeholder, value, handleChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="password-input">
            <input
                type={showPassword ? "text" : "password"}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
            <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? 
                    <img src="assets/icons/eye-crossed.svg" draggable="false" /> : 
                    <img src="assets/icons/eye.svg" draggable="false" />
                }
            </button>
        </div>
    );
};

export default PasswordInput;