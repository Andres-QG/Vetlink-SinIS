import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute ({children, requiredRole='null'}) {
    const { role } = useContext(AuthContext);

    const redirectItems = new Map([
        [1, 'owner'],
        [2, 'admin'],
        [3, 'vet'],
        [4, 'clnt'],
    ]);
       
    return redirectItems.get(role) === requiredRole ? children : null;
};

export default ProtectedRoute