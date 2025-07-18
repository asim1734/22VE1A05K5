const express = require('express');
const { connectDB } = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const urlController = require('./controllers/urlController');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', urlRoutes);

app.get('/:shortId', urlController.redirectToLongUrl);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
