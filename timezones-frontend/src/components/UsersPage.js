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
import { styled } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Typography } from "@mui/material";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import EditableUserRow from '../containers/EditableUserRow';
import config from '../config.json';

const {
    roles: ROLES,
} = config;
const ROLES_VALUES = Object.values(ROLES);

const Wrapper = styled('article')({
    height: '90%',
});

const UsersPageComponent = ({
    isLoading,
    currentlyEditedUsername,
    usersList,
    addNewUser,
    deleteUser,
    editUser,
    submitUserChanges,
    discardUserChanges,
    currentUserRole,
    error,
    closeError,
}) => {
    const [ role, setRole ] = useState(ROLES.user);

    return (
        <Wrapper>
            <Typography
                variant="h3"
            >
                Users
            </Typography>
            {error && (
                <Alert
                    severity="error"
                    action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={closeError}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}
            <form onSubmit={addNewUser}>
                <TableContainer
                    component={Paper}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Username
                                </TableCell>
                                <TableCell>
                                    Password
                                </TableCell>
                                {currentUserRole === ROLES.admin && (
                                    <TableCell>
                                        Role
                                    </TableCell>
                                )}
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
                                        id="username"
                                        label="Username"
                                        variant="standard"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        required
                                        id="password"
                                        label="Password"
                                        variant="standard"
                                    />
                                </TableCell>
                                {currentUserRole === ROLES.admin && (
                                    <TableCell>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel id="roleLabel">
                                                Role
                                            </InputLabel>
                                            <Select
                                                required
                                                inputProps={{
                                                    id: "role"
                                                }}
                                                labelId="roleLabel"
                                                value={role}
                                                onChange={event => setRole(event.target.value)}
                                            >
                                                {ROLES_VALUES.map(roleValue => (
                                                    <MenuItem
                                                        value={roleValue}
                                                        key={roleValue}
                                                    >
                                                        {roleValue}
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
                            {usersList.map(user => (
                                <React.Fragment key={user.id}>
                                    {user.username === currentlyEditedUsername && (
                                        <EditableUserRow
                                            isLoading={isLoading}
                                            user={user}
                                            submitUserChanges={submitUserChanges}
                                            discardUserChanges={discardUserChanges}
                                            currentUserRole={currentUserRole}
                                        />
                                    )}
                                    {user.username !== currentlyEditedUsername && (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                {user.username}
                                            </TableCell>
                                            <TableCell>
                                                {user.password}
                                            </TableCell>
                                            {currentUserRole === ROLES.admin && (
                                                <TableCell>
                                                    {user.role}
                                                </TableCell>
                                            )}
                                            <TableCell>                                            
                                                <LoadingButton
                                                    size="small"
                                                    loading={isLoading}
                                                    variant="text"
                                                    onClick={() => deleteUser(user.username)}
                                                >
                                                    <RemoveIcon />
                                                </LoadingButton>
                                                <LoadingButton
                                                    size="small"
                                                    loading={isLoading}
                                                    variant="text"
                                                    onClick={() => editUser(user.username)}
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

export default UsersPageComponent;