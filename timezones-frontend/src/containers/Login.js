import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeJwt from 'jwt-decode';

import LoginComponent from '../components/Login';
import sendHttpRequest from '../utils/sendHttpRequest';


const LoginContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState('');
    let navigate = useNavigate();

    const loginHandler = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        const {
            username: usernameElement,
            password: passwordElement,
        } = event.target.elements;

        try {
            const token = await sendHttpRequest({
                method: 'POST',
                endpoint: '/account/login',
                returnText: true,
                authorize: false,
                data: {
                    username: usernameElement.value,
                    password: passwordElement.value,
                },
            });

            localStorage.setItem('accessToken', token);
            
            const decodedToken = decodeJwt(token);

            decodedToken.role === 'userManager' ?
                navigate('/users') :
                navigate('/timezones');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <LoginComponent
            isLoading={isLoading}
            error={error}
            login={loginHandler}
        />
    );
};

export default LoginContainer;