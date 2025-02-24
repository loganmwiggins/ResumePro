import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/Login.css';
import PasswordInput from '../components/PasswordInput';
import { showToast } from '../utils/Toast';

function Login() {
    // State variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberme, setRememberme] = useState(false);
    const navigate = useNavigate();

    // Handle change events for input fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") setRememberme(checked);
        else if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
    };

    const handleRegisterClick = () => {
        navigate("/signup");
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate email and password
        if (!email || !password) {
            showToast("Please fill in all fields.", "warning");
            return;
        }

        // Determine login URL based on "Remember Me"
        const loginUrl = rememberme ? "/login?useCookies=true" : "/login?useSessionCookies=true";

        fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => {
                if (response.ok) {
                    window.location.href = "/home"; // Need to refresh to register cookie
                    showToast("Successful login.", "success");
                } else {
                    showToast("Error logging in.", "error");
                }
            })
            .catch((error) => {
                console.error(error);
                showToast("Error logging in.", "error");
            });
    };

    return (
        <div className="page-ctnr-center">
            <div className="login-modal">
                {/* GRAPHIC SIDE */}
                <div className="graphic-ctnr">
                    <img src="assets/images/resume-2.webp" draggable="false" />
                </div>

                {/* FORM SIDE */}
                <div className="form-ctnr">
                    <div className="form-title">
                        <img src="assets/icons/resume-logo.svg" className="icon-dynamic" draggable="false" />
                        <h3>ResumePro</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-header">
                            <h3>Welcome Back</h3>
                            <p>Enter your email and password to access your account.</p>
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
                        
                        <div className="remember-forgot-ctnr">
                            {/* Remember Me input */}
                            <div className="checkbox-ctnr">
                                <input 
                                    type="checkbox" 
                                    id="rememberme" 
                                    name="rememberme" 
                                    title="If checked, your login will persist through browser sessions."
                                    checked={rememberme} 
                                    onChange={handleChange} 
                                />
                                <span>Remember me</span>
                            </div>
                            {/* Forgot password link */}
                            <a href="#">Forgot password?</a>
                        </div>
                        
                        <button type="submit" className="btn-login">Login</button>
                    </form>

                    <div className="signup-ctnr">
                        <p>Don't have an account?</p>
                        <a href="#" onClick={handleRegisterClick}>Sign up</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;