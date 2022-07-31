import { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';


const EditableTimezoneRow = ({
    isLoading,
    timezone,
    submitTimezoneChanges,
    discardTimezoneChanges,
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
                <TextField
                    required
                    id="timeDifference"
                    label="Time Difference"
                    variant="standard"
                    value={timeDifference}
                    onChange={event => setTimeDifference(event.target.value)}
                />
            </TableCell>
            <TableCell>
                <TextField
                    required
                    id="username"
                    label="Username"
                    variant="standard"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                />
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