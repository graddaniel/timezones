import React from 'react';
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
import { styled } from '@mui/system';

import EditableTimezoneRow from '../containers/EditableTimezoneRow';

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
}) => {
    return (
        <Wrapper>
            <form onSubmit={addNewTimezone}>
                <TableContainer
                    component={Paper}
                >
                    <Table>
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
                                <TableCell>
                                    Username
                                </TableCell>
                                <TableCell>
                                    Operation
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
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
                                    <TextField
                                        required
                                        id="timeDifference"
                                        label="Time Difference"
                                        variant="standard"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        required
                                        id="username"
                                        label="Username"
                                        variant="standard"
                                    />
                                </TableCell>
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
                            {timezonesList.map(timezone => (
                                <React.Fragment key={timezone.id}>
                                    {timezone.id === currentlyEditedTimezoneId && (
                                        <EditableTimezoneRow
                                            isLoading={isLoading}
                                            timezone={timezone}
                                            submitTimezoneChanges={submitTimezoneChanges}
                                            discardTimezoneChanges={discardTimezoneChanges}
                                        />
                                    )}
                                    {timezone.id !== currentlyEditedTimezoneId && (
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
                                            <TableCell>
                                                {timezone.username}
                                            </TableCell>
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
                                            </TableCell>
                                        </TableRow>
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