const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

router.post('/shorten', urlController.handleCreateShortUrl);

router.get('/analytics/:shortId', urlController.getAnalytics);

module.exports = router;
