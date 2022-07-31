import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';


const RegisterPage = ({
    isLoading,
    error,
    login,
}) => {
    return (
        <Box sx={{ width: '25%' }}>
            <form onSubmit={login}>
                <Stack spacing={2}>
                    <TextField
                        required
                        id="username"
                        label="Username"
                        variant="standard"
                    />
                    <TextField
                        required
                        id="password"
                        type="password"
                        label="Password"
                        variant="standard"
                    />
                    <TextField
                        required
                        id="repeatedPassword"
                        type="repeatedPassword"
                        label="Repeat Password"
                        variant="standard"
                    />
                    <LoadingButton
                        loading={isLoading}
                        variant="contained"
                        type="submit"
                    >
                        Register
                    </LoadingButton>
                    {error && (
                        <Alert
                            severity="error"
                        >
                            {error}
                        </Alert>
                    )}
                </Stack>
            </form>
        </Box>
    );
};

export default RegisterPage;