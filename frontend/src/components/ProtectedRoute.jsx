import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Error from '../routes/Error';

function ProtectedRoute ({children, requiredRole='null'}) {
    const { role } = useContext(AuthContext);

    const redirectItems = new Map([
        [1, 'owner'],
        [2, 'admin'],
        [3, 'vet'],
        [4, 'clnt'],
        [5, 'reset'],
    ]);
       
    return redirectItems.get(role) === requiredRole ? children : <Error/>;
};

export default ProtectedRoute