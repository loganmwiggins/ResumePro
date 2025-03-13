import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/BaseUrl";

const UserContext = createContext({ user: null, userLoading: true });

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/user/info`, {
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
                setUserLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <UserContext.Provider value={{ user, userLoading, setUser }}>
            {children}
        </UserContext.Provider>
    ); 
};

export const useUser = () => useContext(UserContext);