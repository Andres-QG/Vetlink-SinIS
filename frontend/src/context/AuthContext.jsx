import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [role, setRole] = useState(0);

    const fetchUserRole = async () => {
        try {
            console.log("Creando solicitud")
            const response = await axios.get('http://localhost:8000/api/get-user-role/', {
                withCredentials: true,
            });
            if (response.data.role) {
                setRole(response.data.role)
            } else {
                setRole(0)
            }
            console.log(response)
        } catch (error) {
            setRole(0)
        }
    };

    return (
        <AuthContext.Provider value={{ role, setRole, fetchUserRole }}>
            {children} 
        </AuthContext.Provider>
    );
} export default AuthProvider;