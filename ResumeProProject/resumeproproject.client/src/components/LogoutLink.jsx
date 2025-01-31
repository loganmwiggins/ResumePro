import { useNavigate } from "react-router-dom";

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
                }
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    };

    return (
        <button onClick={handleLogoutClick}>
            {children}
        </button>
    );
}

export default LogoutLink;
