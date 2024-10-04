import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [role, setRole] = useState(0);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get-user-role/', {
                    withCredentials: true,  
                });
                if (response.data.role) {
                    setRole(response.data.role)
                } else {
                    setRole(0)
                }
            } catch (error) {
                setRole(0)
            }
        };
        fetchUserRole();
    }, [role]);

    return (
        <AuthContext.Provider value={{ role }}>
            {children} 
        </AuthContext.Provider>
    );
} export default AuthProvider;