import {
    useState,
    useEffect
} from 'react';
import { useNavigate } from 'react-router-dom';

import TimezonesPageComponent from '../components/TimezonesPage';
import sendHttpRequest from '../utils/sendHttpRequest';

const TimezonesPageContainer = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ currentlyEditedTimezoneId, setCurrentlyEditedTimezoneId ] = useState(false);
    const [ timezonesList, setTimezonesList ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTimezonesList();
    }, []);

    const getTimezonesList = async () => {
        setIsLoading(true);

        try {
            const response = await sendHttpRequest({
                endpoint: '/timezone/list',
            }, navigate);

            setTimezonesList(response);
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
            await sendHttpRequest({
                method: 'POST',
                endpoint: '/timezone/add',
                returnText: true,
                data: {
                    name: nameElement.value,
                    cityName: cityNameElement.value,
                    timeDifference: timeDifferenceElement.value,
                    username: usernameElement.value,
                }
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
        />
    );
}

export default TimezonesPageContainer;