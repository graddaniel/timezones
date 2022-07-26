const express = require('express');
const cors = require('cors');

const PORT = 8080;

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.get('/', (req, res) => {
    res.status(200).send("Hello World!");
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));