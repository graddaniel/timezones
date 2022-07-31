import { useState } from 'react';

import RegisterComponent from '../components/Register';
import sendHttpRequest from '../utils/sendHttpRequest';


const RegisterContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const [ message, setMessage ] = useState('');

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

            const response = await sendHttpRequest({
                method: 'POST',
                endpoint: '/account/register',
                returnText: true,
                authorize: false,
                data: {
                    username: usernameElement.value,
                    password: passwordElement.value,
                },
            });

            setMessage(response);
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
            message={message}
            login={registerHandler}
        />
    );
};

export default RegisterContainer;