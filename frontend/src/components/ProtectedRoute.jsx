import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Loading from "../routes/Loading";

function ProtectedRoute ({children, requiredRole='null'}) {
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const redirectItems = new Map([
        [1, 'owner'],
        [2, 'admin'],
        [3, 'vet'],
        [4, 'clnt'],
    ]);

    useEffect(() => {
        let isMounted = true;

        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get-user-role/', {
                    withCredentials: true,  
                });
                setRole(response.data.role);
                setIsLoading(false)

                if (redirectItems.get(response.data.role) !== requiredRole) {
                    navigate('/error');  
                }
            } catch (error) {
                console.error('Error fetching role:', error);
                navigate('/error');
            }
        };
        fetchUserRole();

        return () => {
            isMounted = false;
        };

    }, [navigate, requiredRole]);

    if (isLoading) {
        return <Loading/>
    }
       

    return redirectItems.get(role) === requiredRole ? children : null;
};

export default ProtectedRoute