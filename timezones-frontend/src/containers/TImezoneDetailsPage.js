import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import Button from '@mui/material/Button';

import getTimeWithDifference from '../utils/getTimeWithDifference';
import config from '../config.json';

const TimezoneDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        timeDifference,
        cityName
    } = location.state.timezone;

    const [ time, setTime ] = 
        useState(getTimeWithDifference(timeDifference));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(getTimeWithDifference(timeDifference));
        }, config.timezonesRefreshIntervalInMS);

        return () => clearInterval(intervalId);
    }, []);

    return (      
        <Box>
            <Typography
                variant="h3"
            >
                Time in {cityName} is {time} ({timeDifference})
            </Typography>
            <Button
                variant="outlined"
                onClick={() => navigate('/timezones')}
            >
                Back to Timezones
            </Button>
        </Box>
    );
}

export default TimezoneDetailsPage;