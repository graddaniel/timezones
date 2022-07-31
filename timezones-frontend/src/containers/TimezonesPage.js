import {
    useState,
    useEffect
} from 'react';
import { useNavigate } from 'react-router-dom';

import TimezonesPageComponent from '../components/TimezonesPage';
import sendHttpRequest from '../utils/sendHttpRequest';
import throttle from '../utils/throttle';
import useRole from '../hooks/useRole';
import useUsername from '../hooks/useUsername';

import config from '../config.json';

const {
    roles: ROLES,
    throttleDelayInMS: THROTTLE_DELAY_IN_MS,
} = config;

const TimezonesPageContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ currentlyEditedTimezoneId, setCurrentlyEditedTimezoneId ] = useState(false);
    const [ timezonesList, setTimezonesList ] = useState([]);
    const [ usernames, setUsernames ] = useState([]);
    const navigate = useNavigate();
    const currentUserRole = useRole();
    const currentUserName = useUsername();

    useEffect(() => {
        getTimezonesList();

        if (currentUserRole === ROLES.admin) {
            getUsernames();
        }
    }, []);

    const getTimezonesList = async (name = null) => {
        setIsLoading(true);

        try {
            const response = await sendHttpRequest({
                endpoint: '/timezone/list',
                urlParams: name ? { name } : null,
            }, navigate);

            setTimezonesList(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const getUsernames = async () => {
        setIsLoading(true);

        try {
            const response = await sendHttpRequest({
                endpoint: '/user/names',
            }, navigate);

            setUsernames(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const addNewTimezone = async event => {
        event.preventDefault();

        setIsLoading(true);

        //TODO username wont appear (from edit), because its not an input
        const {
            name: nameElement,
            cityName: cityNameElement,
            timeDifference: timeDifferenceElement,
            username: usernameElement
        } = event.target.elements;

        try {
            const timezoneData = {
                name: nameElement.value,
                cityName: cityNameElement.value,
                timeDifference: timeDifferenceElement.value,
                username: currentUserRole === ROLES.admin ?
                    usernameElement.value :
                    currentUserName
            };

            await sendHttpRequest({
                method: 'POST',
                endpoint: '/timezone/add',
                returnText: true,
                data: timezoneData,
            }, navigate);

            getTimezonesList();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const updateTimezone = async updatedTimezone => {
        setIsLoading(true);

        try {
            await sendHttpRequest({
                method: 'PATCH',
                endpoint: '/timezone/edit',
                returnText: true,
                data: updatedTimezone,
            }, navigate);

            getTimezonesList();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteTimezone = async id => {
        setIsLoading(true);

        try {
            await sendHttpRequest({
                method: 'DELETE',
                endpoint: '/timezone/delete',
                returnText: true,
                urlParams: {
                    id
                }
            }, navigate);

            getTimezonesList();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const displayTimezone = id => {
        const timezoneToDisplay = timezonesList.find(
            timezone => timezone.id === id
        );

        navigate(
            '/timezoneDetails',
            {
                state: {
                    timezone: timezoneToDisplay,
                }
            }
        );
    }

    const filterTimezonesByName = name => {
        throttle(getTimezonesList, THROTTLE_DELAY_IN_MS, name);
    }

    return (
        <TimezonesPageComponent
            isLoading={isLoading}
            currentlyEditedTimezoneId={currentlyEditedTimezoneId}
            timezonesList={timezonesList}
            addNewTimezone={addNewTimezone}
            deleteTimezone={deleteTimezone}
            editTimezone={id => setCurrentlyEditedTimezoneId(id)}
            submitTimezoneChanges={updatedTimezone => {
                updateTimezone(updatedTimezone);
                setCurrentlyEditedTimezoneId(null);
            }}
            discardTimezoneChanges={() => setCurrentlyEditedTimezoneId(null)}
            displayTimezone={displayTimezone}
            usernames={usernames}
            currentUserRole={currentUserRole}
            filterTimezonesByName={filterTimezonesByName}
        />
    );
}

export default TimezonesPageContainer;