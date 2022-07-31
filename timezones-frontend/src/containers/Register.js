import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import decodeJwt from 'jwt-decode';

import RegisterComponent from '../components/Register';
import sendHttpRequest from '../utils/sendHttpRequest';


const RegisterContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState('');
    let navigate = useNavigate();

    const registerHandler = async (event) => {
        event.preventDefault();

        const {
            username: usernameElement,
            password: passwordElement,
            repeatedPassword: repeatedPasswordElement,
        } = event.target.elements;

        if (passwordElement.value !== repeatedPasswordElement.value) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setIsLoading(true);

            const token = await sendHttpRequest({
                method: 'POST',
                endpoint: '/account/register',
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
        <RegisterComponent
            isLoading={isLoading}
            error={error}
            login={registerHandler}
        />
    );
};

export default RegisterContainer;