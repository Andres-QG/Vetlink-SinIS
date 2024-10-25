import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [role, setRole] = useState(undefined);

  const fetchUserRole = async () => {
    if (role !== 5) {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/get-user-role/",
          {
            withCredentials: true,
          }
        );
        if (response.data.role) {
          setRole(response.data.role);
        } else {
          setRole(undefined);
        }
      } catch (error) {
        setRole(undefined);
      }
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole, fetchUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
