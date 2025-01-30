import '../stylesheets/Login.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="containerbox">
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="forminput" htmlFor="email">Email:</label>
                </div>
                <div>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                </div>
                <div>
                    <input type="password" id="password" name="password" value={password} onChange={handleChange} />
                </div>
                <div>
                    <input type="checkbox" id="rememberme" name="rememberme" checked={rememberme} onChange={handleChange} />
                    <span>Remember Me</span>
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
                <div>
                    <button type="button" onClick={handleRegisterClick}>Register</button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Login;
