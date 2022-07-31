import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import PageviewIcon from '@mui/icons-material/Pageview';
import { styled } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Typography } from "@mui/material";

import EditableTimezoneRow from '../containers/EditableTimezoneRow';
import config from '../config.json';

const {
    timezones: TIMEZONES,
    roles: ROLES,
} = config;

const Wrapper = styled('article')({
    height: '90%',
});

const TimezonesPageComponent = ({
    isLoading,
    currentlyEditedTimezoneId,
    timezonesList,
    addNewTimezone,
    deleteTimezone,
    editTimezone,
    submitTimezoneChanges,
    discardTimezoneChanges,
    displayTimezone,
    usernames,
    currentUserRole,
    filterTimezonesByName,
}) => {
    const [ timeDifference, setTimeDifference ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ filterValue, setFilterValue ] = useState('');

    const tableHeader = (
        <TableHead>
            <TableRow>
                <TableCell>
                    Name
                </TableCell>
                <TableCell>
                    City Name
                </TableCell>
                <TableCell>
                    Time Difference
                </TableCell>
                {currentUserRole === ROLES.admin && (
                    <TableCell>
                        Username
                    </TableCell>
                )}
                <TableCell>
                    Operation
                </TableCell>
            </TableRow>
        </TableHead>
    );

    const newEntryRow = (
        <TableRow>
            <TableCell>
                <TextField
                    required
                    id="name"
                    label="Name"
                    variant="standard"
                />
            </TableCell>
            <TableCell>
                <TextField
                    required
                    id="cityName"
                    label="City Name"
                    variant="standard"
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
            {currentUserRole === ROLES.admin && (
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
            )}
            <TableCell>
                <LoadingButton
                    size="small"
                    type="submit"
                    loading={isLoading}
                    variant="text"
                >
                    <AddIcon />
                </LoadingButton>
            </TableCell>
        </TableRow>
    );

    const generateDisplayRow = (timezone) => (
        <TableRow key={timezone.id}>
            <TableCell>
                {timezone.name}
            </TableCell>
            <TableCell>
                {timezone.cityName}
            </TableCell>
            <TableCell>
                {timezone.timeDifference}
            </TableCell>
            {currentUserRole === ROLES.admin && (
                <TableCell>
                    {timezone.username}
                </TableCell>
            )}
            <TableCell>                                            
                <LoadingButton
                    size="small"
                    loading={isLoading}
                    variant="text"
                    onClick={() => deleteTimezone(timezone.id)}
                >
                    <RemoveIcon />
                </LoadingButton>
                <LoadingButton
                    size="small"
                    loading={isLoading}
                    variant="text"
                    onClick={() => editTimezone(timezone.id)}
                >
                    <EditIcon />
                </LoadingButton>
                <LoadingButton
                    size="small"
                    loading={isLoading}
                    variant="text"
                    onClick={() => displayTimezone(timezone.id)}
                >
                    <PageviewIcon />
                </LoadingButton>
            </TableCell>
        </TableRow>
    )

    return (
        <Wrapper>
            <Typography
                variant="h3"
            >
                Timezones
            </Typography>
            <TextField
                id="nameFilter"
                label="Filter by name"
                type="search"
                value={filterValue}
                onChange={event => {
                    setFilterValue(event.target.value);
                    filterTimezonesByName(event.target.value);
                }}
            />
            <form onSubmit={addNewTimezone}>
                <TableContainer
                    component={Paper}
                >
                    <Table>
                        {tableHeader}
                        <TableBody>
                            {newEntryRow}
                            {timezonesList.map(timezone => (
                                <React.Fragment key={timezone.id}>
                                    {timezone.id === currentlyEditedTimezoneId && (
                                        <EditableTimezoneRow
                                            isLoading={isLoading}
                                            timezone={timezone}
                                            submitTimezoneChanges={submitTimezoneChanges}
                                            discardTimezoneChanges={discardTimezoneChanges}
                                            usernames={usernames}
                                            currentUserRole={currentUserRole}
                                        />
                                    )}
                                    {timezone.id !== currentlyEditedTimezoneId && (
                                       generateDisplayRow(timezone) 
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </form>
        </Wrapper>
    );
}

export default TimezonesPageComponent;