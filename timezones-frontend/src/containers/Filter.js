import { useState } from 'react';
import TextField from '@mui/material/TextField';

import throttle from '../utils/throttle';
import config from '../config.json';


const {
    throttleDelayInMS: THROTTLE_DELAY_IN_MS,
} = config;

const Filter = ({
    label,
    onFilter,
}) => {
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = event => {
        const newFilterValue = event.target.value;

        setFilterValue(newFilterValue);

        throttle(onFilter, THROTTLE_DELAY_IN_MS, newFilterValue);
    }

    return (
        <TextField
                label={label}
                type="search"
                value={filterValue}
                onChange={handleFilterChange}
            />
    );
};

export default Filter;