import {
    useState,
    useEffect,
    useCallback,
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
    const [ filter, setFilter ] = useState('');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ pageCount, setPageCount ] = useState(0);
    const [ error, setError ] = useState();
    const navigate = useNavigate();
    const currentUserRole = useRole();
    const currentUserName = useUsername();

    console.log(currentPage)

    useEffect(() => {
        getTimezonesListByFilter();

        if (currentUserRole === ROLES.admin) {
            getUsernames();
        }
    }, []);

    useEffect(() => {
        throttle(getTimezonesListByFilter, THROTTLE_DELAY_IN_MS, filter);
    }, [filter]);

    const goToPage = (page) => {
        setCurrentPage(page);
        getTimezonesListByFilter(filter, page);
    }

    const getTimezonesListByFilter = useCallback(
        async (name = filter, page = 1) => {

            setIsLoading(true);

            try {
                const urlParams = {
                    page: page - 1,
                };
                if (name) {
                    urlParams.name = name;
                } 

                const response = await sendHttpRequest({
                    endpoint: '/timezone/list',
                    urlParams,
                }, navigate);

                const {
                    timezones,
                    pageCount
                } = response;

                console.log("PAGE_COUNT", pageCount)

                setPageCount(pageCount);
                setTimezonesList(timezones);
                setError(null);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setError, navigate, setTimezonesList, filter]
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
            filter={filter}
            setFilter={setFilter}
            currentPage={currentPage}
            goToPage={goToPage}
            pageCount={pageCount}
        />
    );
}

export default TimezonesPageContainer;