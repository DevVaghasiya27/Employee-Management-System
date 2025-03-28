import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const userContext = createContext();

const AuthProvider = ({ children }) => {  // ✅ Use PascalCase for component name
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get(
                        "http://localhost:5000/api/auth/verify",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    console.log(response);
                    if (response.data.success) {
                        setUser(response.data.user);
                    }
                } else {
                    setUser(null);
                    setLoading(false);
                }
            } catch (error) {
                if (error.response && !error.response.data.error) {
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, []);

    const login = (user) => {
        setUser(user);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <userContext.Provider value={{ user, setUser, login, logout, loading }}>
            {/* ✅ Added `setUser` to context */}
            {children}
        </userContext.Provider>
    );
};

export const useAuth = () => useContext(userContext);
export default AuthProvider; // ✅ Fixed incorrect export
