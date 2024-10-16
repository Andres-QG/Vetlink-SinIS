import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Error from '../routes/Error';
import Loading from './Loading';

function ProtectedRoute ({children, requiredRoles}) {
    const { role, fetchUserRole } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyRole = async () => {
            await fetchUserRole();
            setLoading(false);
        };
        verifyRole();
    }, [fetchUserRole]);

    if (loading) {
        return <Loading text={"Cargando..."}/>
    }

    console.log("Protect: " + role)
    console.log(requiredRoles)
    if (!requiredRoles?.includes(role)) {
        document.cookie = "active=false; path=/;";
        return <Error />;
    }

    return children;
};

export default ProtectedRoute;