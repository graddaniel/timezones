const express = require('express');
const cors = require('cors');
const config = require('config');

const app = express();

const {
    host: CORS_HOST,
    port: CORS_PORT,
} = config.get('cors');
const {
    port: SERVER_PORT
} = config.get('server');

app.use(cors({
    origin: `http://${CORS_HOST}:${CORS_PORT}`,
}));

app.get('/', (req, res) => {
    res.status(200).send("Hello World!");
});

app.listen(SERVER_PORT, () => console.log(`Listening on port: ${SERVER_PORT}`));