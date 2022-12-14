import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeJwt from 'jwt-decode';

import LoginPageComponent from '../components/LoginPage';
import sendHttpRequest from '../utils/sendHttpRequest';
import config from '../config.json';

const {
  roles: {
    userManager: USER_MANAGER,
    admin: ADMIN,
  }
} = config;

const LoginPageContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState('');
    let navigate = useNavigate();

    const closeError = () => setError('');

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

            [USER_MANAGER, ADMIN].includes(decodedToken.role) ?
                navigate('/users') :
                navigate('/timezones');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <LoginPageComponent
            isLoading={isLoading}
            error={error}
            closeError={closeError}
            login={loginHandler}
        />
    );
};

export default LoginPageContainer;