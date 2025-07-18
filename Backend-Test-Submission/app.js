const express = require('express');
const { connectDB } = require('./config/db');

const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
