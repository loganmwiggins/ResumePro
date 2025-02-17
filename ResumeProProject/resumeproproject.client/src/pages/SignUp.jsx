import { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../stylesheets/Login.css';
import PasswordInput from "../components/PasswordInput";
import { showToast } from "../utils/Toast";

function SignUp() {
    // State variables
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    // Navigate to login page
    const handleLoginClick = () => {
        navigate("/login");
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "firstname") setFirstName(value);
        else if (name === "lastname") setLastName(value);
        else if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
        else if (name === "confirmPassword") setConfirmPassword(value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showToast("Please fill in all fields.", "warning");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast("Please enter a valid email address.", "warning");
            return;
        }
        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "warning");
            return;
        }

        // Send request to API
        try {
            const response = await fetch("https://localhost:7035/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                showToast("Your account has been created.", "success", "Thanks for Joining!");
                navigate("/login");
            }
            else {
                data.message || showToast("Error signing up.", "error");
            }
        }
        catch (error) {
            showToast("Error signing up. Please try again.", "error");
            console.error(error);
        }
    };

    return (
        <div className="page-ctnr-center">
            <div className="login-modal">
                {/* GRAPHIC SIDE */}
                <div className="graphic-ctnr">
                    <img src="assets/images/resume-1.webp" draggable="false" />
                </div>

                {/* FORM SIDE */}
                <div className="form-ctnr">
                    <div className="form-title">
                        <img src="assets/icons/resume-logo.svg" draggable="false" />
                        <h3>ResumePro</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-header">
                            <h3>Create an Account</h3>
                            <p>Enter the following information to sign up and create your account.</p>
                        </div>

                        <div className="input-row">
                            {/* First Name input */}
                            <input 
                                type="text" 
                                id="firstname" 
                                name="firstname" 
                                placeholder="First Name"
                                value={firstName} 
                                onChange={handleChange} 
                            />
                            {/* Last Name input */}
                            <input 
                                type="text" 
                                id="lastname" 
                                name="lastname" 
                                placeholder="Last Name"
                                value={lastName} 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        {/* Email input */}
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Email"
                            value={email} 
                            onChange={handleChange} 
                        />

                        {/* Password input */}
                        <PasswordInput
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            handleChange={handleChange}
                        />

                        {/* Confirm Password input */}
                        <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            handleChange={handleChange}
                        />

                        <button type="submit" className="btn-login">Sign Up</button>
                    </form>

                    <div className="signup-ctnr">
                        <p>Already have an account?</p>
                        <a href="#" onClick={handleLoginClick}>Login</a>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SignUp;
