import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/Toast';

function LogoutLink({ children }) {
    const navigate = useNavigate();

    const handleLogoutClick = (e) => {
        e.preventDefault();
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: ""
        })
            .then((response) => {
                if (response.ok) {
                    navigate("/login");
                    showToast("Logged out successfully.", "success");
                }
            })
            .catch((error) => {
                console.error("Logout failed:", error);
                showToast("Logout failed.", "error");
            });
    };

    return (
        <button onClick={handleLogoutClick}>
            {children}
        </button>
    );
}

export default LogoutLink;