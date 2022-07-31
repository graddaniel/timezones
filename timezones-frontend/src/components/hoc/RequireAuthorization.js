import { Navigate } from 'react-router-dom';
import decodeJwt from 'jwt-decode';

const RequireAuthorization = ({ children, requiredRoles }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/login"/>
    }

    const decodedToken = decodeJwt(token);

    if (!requiredRoles.includes(decodedToken.role)) {

        return <Navigate to="/403" />
    }

    return children;
}

export default RequireAuthorization;