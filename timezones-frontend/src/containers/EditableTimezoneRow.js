import { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import config from '../config.json';

const { timezones: TIMEZONES } = config;

const EditableTimezoneRow = ({
    isLoading,
    timezone,
    submitTimezoneChanges,
    discardTimezoneChanges,
    usernames,
}) => {
    const [ name, setName ] = useState(timezone.name);
    const [ cityName, setCityName ] = useState(timezone.cityName);
    const [ timeDifference, setTimeDifference ] = useState(timezone.timeDifference);
    const [ username, setUsername ] = useState(timezone.username);

    return (
        <TableRow key={timezone.id}>
            <TableCell>
                <TextField
                    required
                    id="name"
                    label="Name"
                    variant="standard"
                    value={name}
                    onChange={event => setName(event.target.value)}
                />
            </TableCell>
            <TableCell>
                <TextField
                    required
                    id="cityName"
                    label="City Name"
                    variant="standard"
                    value={cityName}
                    onChange={event => setCityName(event.target.value)}
                />
            </TableCell>
            <TableCell>
                <FormControl fullWidth variant="standard">
                    <InputLabel id="timeDifferenceLabel">
                        Time Difference
                    </InputLabel>
                    <Select
                        required
                        inputProps={{
                            id: "timeDifference"
                        }}
                        labelId="timeDifferenceLabel"
                        value={timeDifference}
                        onChange={event => setTimeDifference(event.target.value)}
                    >
                        {TIMEZONES.map(timezone => (
                            <MenuItem
                                value={timezone}
                                key={timezone}
                            >
                                {timezone}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell>
                <FormControl fullWidth variant="standard">
                    <InputLabel id="usernameLabel">
                        Username
                    </InputLabel>
                    <Select
                        required
                        inputProps={{
                            id: "username"
                        }}
                        labelId="usernameLabel"
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                    >
                        {usernames.map(username => (
                            <MenuItem
                                value={username}
                                key={username}
                            >
                                {username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell>
                <LoadingButton
                    size="small"
                    loading={isLoading}
                    variant="text"
                    onClick={() => submitTimezoneChanges({
                        id: timezone.id,
                        name,
                        cityName,
                        timeDifference,                        
                        username,
                    })}
                >
                    <CheckIcon />
                </LoadingButton>
                <LoadingButton
                    size="small"
                    loading={isLoading}
                    variant="text"
                    onClick={() => discardTimezoneChanges()}
                >
                    <ClearIcon />
                </LoadingButton>
            </TableCell>
        </TableRow>
    );
}

export default EditableTimezoneRow;