import { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../stylesheets/Login.css';
import PasswordInput from "../components/PasswordInput";

function SignUp() {
    // State variables
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
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
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate input fields
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError(""); // Clear errors

        // Send request to API
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => {
                if (response.ok) {
                    setError("Successful sign-up.");
                } else {
                    setError("Error signing up.");
                }
            })
            .catch((error) => {
                console.error(error);
                setError("Error signing up.");
            });
    };

    return (
        <div className="login-ctnr">
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

                <form onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h3>Create an Account</h3>
                        <p>Enter the following information to sign up and create your account.</p>
                    </div>

                    <div className="input-row">
                        {/* First Name input */}
                        <input 
                            type="firstname" 
                            id="firstname" 
                            name="firstname" 
                            placeholder="First Name"
                            value={firstName} 
                            onChange={handleChange} 
                        />
                        {/* Last Name input */}
                        <input 
                            type="lastname" 
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

                    {error && <p className="error">{error}</p>}
                </form>

                <div className="signup-ctnr">
                    <p>Already have an account?</p>
                    <a href="#" onClick={handleLoginClick}>Login</a>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
