import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext({ user: null, loading: true });

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                else {
                    setUser(null);  // If not authenticated, set user to null
                }
            } 
            catch (error) {
                console.error("Error fetching user data:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    ); 
};

export const useUser = () => useContext(UserContext);