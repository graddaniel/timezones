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

const {
    roles: ROLES,
} = config;
const ROLES_VALUES = Object.values(ROLES);

const EditableUserRow = ({
    isLoading,
    user,
    submitUserChanges,
    discardUserChanges,
    currentUserRole,
}) => {
    const [ password, setPassword ] = useState(user.password);
    const [ role, setRole ] = useState(user.role);

    return (
        <TableRow key={user.id}>
            <TableCell>
                {user.username}
            </TableCell>
            <TableCell>
                <TextField
                    required
                    id="password"
                    label="Password"
                    variant="standard"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
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
                    loading={isLoading}
                    variant="text"
                    onClick={() => submitUserChanges({
                        id: user.id,
                        username: user.username,
                        password,                        
                        role,
                    })}
                >
                    <CheckIcon />
                </LoadingButton>
                <LoadingButton
                    size="small"
                    loading={isLoading}
                    variant="text"
                    onClick={() => discardUserChanges()}
                >
                    <ClearIcon />
                </LoadingButton>
            </TableCell>
        </TableRow>
    );
}

export default EditableUserRow;