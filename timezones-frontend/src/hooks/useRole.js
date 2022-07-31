import decodeJwt from 'jwt-decode';


const useRole = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return null;
    }

    const decodedToken = decodeJwt(token);

    return decodedToken.role;
}

export default useRole;