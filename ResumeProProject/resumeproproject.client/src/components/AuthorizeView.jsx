import React, { useState, useEffect, createContext, useContext } from 'react';
import { Navigate } from 'react-router-dom';

const UserContext = createContext({});

function AuthorizeView({ children }) {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ email: "" });

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 10;
        const delay = 1000;

        function wait(delay) {
            return new Promise(resolve => setTimeout(resolve, delay));
        }

        async function fetchWithRetry(url, options) {
            try {
                let response = await fetch(url, options);
                if (response.status === 200) {
                    console.log("Authorized");
                    let data = await response.json();
                    setUser({ email: data.email });
                    setAuthorized(true);
                    return response;
                } else if (response.status === 401) {
                    console.log("Unauthorized");
                    return response;
                } else {
                    throw new Error("" + response.status);
                }
            } catch (error) {
                retryCount++;
                if (retryCount > maxRetries) {
                    throw error;
                } else {
                    await wait(delay);
                    return fetchWithRetry(url, options);
                }
            }
        }

        fetchWithRetry("/pingauth", { method: "GET" })
            .catch(error => console.log(error.message))
            .finally(() => setLoading(false));

    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return authorized ? (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
    ) : (
        <Navigate to="/login" />
    );
}

export function AuthorizedUser({ value }) {
    const user = useContext(UserContext);
    return value === "email" ? <>{user.email}</> : <></>;
}

export default AuthorizeView;
