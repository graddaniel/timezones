import decodeJwt from 'jwt-decode';


const useUsername = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return null;
    }

    const decodedToken = decodeJwt(token);

    return decodedToken.username;
}

export default useUsername;