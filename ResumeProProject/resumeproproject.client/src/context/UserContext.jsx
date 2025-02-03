import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("https://localhost:7035/api/user/info", {
                    method: "GET",
                    credentials: "include", // Sends auth cookies
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserInfo();
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);