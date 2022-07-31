import {
    useState,
    useEffect
} from 'react';
import { useNavigate } from 'react-router-dom';

import UsersPageComponent from '../components/UsersPage';
import sendHttpRequest from '../utils/sendHttpRequest';

const UsersPageContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ currentlyEditedUsername, setCurrentlyEditedUsername ] = useState(false);
    const [ usersList, setUsersList ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUsersList();
    }, []);

    const getUsersList = async () => {
        setIsLoading(true);

        try {
            const response = await sendHttpRequest({
                endpoint: '/user/list',
            }, navigate);

            setUsersList(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const addNewUser = async event => {
        event.preventDefault();

        setIsLoading(true);

        //TODO username wont appear (from edit), because its not an input
        const {
            username: usernameElement,
            password: passwordElement,
            role: roleElement,
        } = event.target.elements;

        try {
            await sendHttpRequest({
                method: 'POST',
                endpoint: '/user/add',
                returnText: true,
                data: {
                    username: usernameElement.value,
                    password: passwordElement.value,
                    role: roleElement.value,
                }
            }, navigate);

            getUsersList();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const updateUser = async updatedUser => {
        setIsLoading(true);

        try {
            await sendHttpRequest({
                method: 'PATCH',
                endpoint: '/user/edit',
                returnText: true,
                data: updatedUser,
            }, navigate);

            getUsersList();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteUser = async username => {
        setIsLoading(true);

        try {
            await sendHttpRequest({
                method: 'DELETE',
                endpoint: '/user/delete',
                returnText: true,
                urlParams: {
                    username
                }
            }, navigate);

            getUsersList();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <UsersPageComponent
            isLoading={isLoading}
            currentlyEditedUsername={currentlyEditedUsername}
            usersList={usersList}
            addNewUser={addNewUser}
            deleteUser={deleteUser}
            editUser={username => setCurrentlyEditedUsername(username)}
            submitUserChanges={updatedUser => {
                updateUser(updatedUser);
                setCurrentlyEditedUsername(null);
            }}
            discardUserChanges={() => setCurrentlyEditedUsername(null)}
        />
    );
}

export default UsersPageContainer;