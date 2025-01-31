import { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../stylesheets/Login.css';

function Login() {
    // State variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberme, setRememberme] = useState(false);
    const [error, setError] = useState("");
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
            setError("Please fill in all fields.");
            return;
        }

        setError(""); // Clear errors

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
                    setError("Successful Login.");
                    window.location.href = "/";
                } else {
                    setError("Error Logging In.");
                }
            })
            .catch((error) => {
                console.error(error);
                setError("Error Logging in.");
            });
    };

    return (
        <div className="login-ctnr">
            {/* GRAPHIC SIDE */}
            <div className="graphic-ctnr">
                <img src="assets/images/resume-2.webp" draggable="false" />
            </div>

            {/* FORM SIDE */}
            <div className="form-ctnr">
                <h3>ResumePro</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h3>Welcome Back</h3>
                        <p>Enter your email and password to access your account.</p>
                    </div>

                    {/* Email input */}
                    <div className="form-label">
                        {/* <label htmlFor="email">Email</label> */}
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Email"
                            value={email} 
                            onChange={handleChange} 
                        />
                    </div>
                    {/* Password input */}
                    <div className="form-label">
                        {/* <label htmlFor="password">Password</label> */}
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            placeholder="Password"
                            value={password} 
                            onChange={handleChange} 
                        />
                    </div>
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

                    {error && <p className="error">{error}</p>}
                </form>

                <div className="signup-ctnr">
                    <p>Don't have an account?</p>
                    <a href="#" onClick={handleRegisterClick}>Sign up</a>
                </div>
            </div>
        </div>
    );
}

export default Login;