import { useState } from 'react';

import RegistrationPageComponent from '../components/RegistrationPage';
import sendHttpRequest from '../utils/sendHttpRequest';


const RegistrationPageContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const [ message, setMessage ] = useState('');

    const registrationHandler = async (event) => {
        event.preventDefault();

        const {
            username: usernameElement,
            password: passwordElement,
            repeatedPassword: repeatedPasswordElement,
        } = event.target.elements;

        if (passwordElement.value !== repeatedPasswordElement.value) {
            setError('Passwords do not match.');
            setMessage(null);
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

            setError(null)
            setMessage(response);
        } catch (error) {
            setError(error.message);
            setMessage(null);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <RegistrationPageComponent
            isLoading={isLoading}
            error={error}
            message={message}
            register={registrationHandler}
        />
    );
};

export default RegistrationPageContainer;