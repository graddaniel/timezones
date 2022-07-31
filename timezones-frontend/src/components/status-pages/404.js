import { Typography } from "@mui/material";

const NotFound404 = () => {
    return (
        <article>
            <Typography
                variant="h1"
            >
                404 Not Found
            </Typography>
            <Typography
                variant="h2"
            >
                Requested page does not exist
            </Typography>
        </article>
    );
}

export default NotFound404;