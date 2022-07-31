import { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';


const EditableUserRow = ({
    isLoading,
    user,
    submitUserChanges,
    discardUserChanges,
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
            <TableCell>
                <TextField
                    required
                    id="role"
                    label="Role"
                    variant="standard"
                    value={role}
                    onChange={event => setRole(event.target.value)}
                />
            </TableCell>
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