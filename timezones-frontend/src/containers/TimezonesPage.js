import {
    useState,
    useRef,
    useEffect,
    useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';

import TimezonesPageComponent from '../components/TimezonesPage';
import sendHttpRequest from '../utils/sendHttpRequest';
import useRole from '../hooks/useRole';
import useUsername from '../hooks/useUsername';

import config from '../config.json';


const {
    roles: ROLES,
} = config;

const TimezonesPageContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ currentlyEditedTimezoneId, setCurrentlyEditedTimezoneId ] = useState(false);
    const [ timezonesList, setTimezonesList ] = useState([]);
    const [ usernames, setUsernames ] = useState([]);
    const filter = useRef('');
    const [ error, setError ] = useState();
    const navigate = useNavigate();
    const currentUserRole = useRole();
    const currentUserName = useUsername();

    useEffect(() => {
        getTimezonesListByFilter();

        if (currentUserRole === ROLES.admin) {
            getUsernames();
        }
    }, []);

    const handleFilterChange = filterValue => {
        filter.current = filterValue;
        getTimezonesListByFilter(filterValue);
    };

    const getTimezonesListByFilter = useCallback(
        async (name = filter.current) => {

            setIsLoading(true);

            try {
                const response = await sendHttpRequest({
                    endpoint: '/timezone/list',
                    urlParams: name ? { name } : null,
                }, navigate);

                setTimezonesList(response);
                setError(null);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setError, navigate, setTimezonesList]
    );

    const getUsernames = useCallback(
        async () => {
            setIsLoading(true);

            try {
                const response = await sendHttpRequest({
                    endpoint: '/user/names',
                }, navigate);

                setUsernames(response);
                setError(null);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setError, navigate, setUsernames]
    )

    const addNewTimezone = useCallback(
        async event => {
            event.preventDefault();

            setIsLoading(true);

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

                getTimezonesListByFilter();
                setError(null);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setError, navigate, getTimezonesListByFilter]
    );

    const updateTimezone = useCallback(
        async updatedTimezone => {
            setIsLoading(true);

            try {
                await sendHttpRequest({
                    method: 'PATCH',
                    endpoint: '/timezone/edit',
                    returnText: true,
                    data: updatedTimezone,
                }, navigate);

                getTimezonesListByFilter();
                setError(null);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setError, navigate, getTimezonesListByFilter]
    );

    const deleteTimezone = useCallback(
        async id => {
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

                getTimezonesListByFilter();
                setError(null);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setError, navigate, getTimezonesListByFilter]
    )

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
            error={error}
            closeError={() => setError(null)}
            onFilter={handleFilterChange}
        />
    );
}

export default TimezonesPageContainer;