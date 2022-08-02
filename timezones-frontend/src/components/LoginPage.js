import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const LoginPage = ({
    isLoading,
    error,
    closeError,
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
                    <LoadingButton
                        loading={isLoading}
                        variant="contained"
                        type="submit"
                    >
                        Login
                    </LoadingButton>
                    <Snackbar
                        open={!!error}
                        autoHideDuration={6000}
                        onClose={closeError}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                    >
                        <Alert
                            onClose={closeError}
                            severity="error"
                        >
                            {error}
                        </Alert>
                    </Snackbar>
                </Stack>
            </form>
        </Box>
    );
};

export default LoginPage;