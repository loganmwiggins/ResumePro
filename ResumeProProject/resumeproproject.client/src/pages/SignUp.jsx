import '../stylesheets/SignUp.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    // State variables
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
        if (name === "email") setEmail(value);
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
        <div className="containerbox">
            <h3>Sign Up</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
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
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                </div>
                <div>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChange} />
                </div>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
                <div>
                    <button type="button" onClick={handleLoginClick}>Go to Login</button>
                </div>
            </form>

            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default SignUp;
