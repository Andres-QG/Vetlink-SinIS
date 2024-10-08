import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Error from '../routes/Error';
import Loading from './Loading';

function ProtectedRoute ({children, requiredRole}) {
    const { role, fetchUserRole } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyRole = async () => {
            setLoading(true);
            await fetchUserRole();
            setLoading(false);
        };
        verifyRole();
    }, [fetchUserRole]);

    const redirectItems = new Map([
        [undefined, 'ntlog'],
        [1, 'owner'],
        [2, 'admin'],
        [3, 'vet'],
        [4, 'clnt'],
        [5, 'reset'],
    ]);

    if (loading) {
        return <Loading text={"Verificando permisos"}/>
    }
       
    console.log("Protect: " + role)
    if (redirectItems.get(role) !== requiredRole) {
        document.cookie = "active=false; path=/;";
        return <Error />;
    }
    return children;
};

export default ProtectedRoute