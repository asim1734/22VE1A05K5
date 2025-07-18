const shortid = require('shortid');
const { getDb } = require('../config/db');
const { createShortUrl } = require('../services/shorturlService');

async function handleCreateShortUrl(req, res) {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing URL.' });
    }

    try {
        const result = await createShortUrl(url);

        const fullShortUrl = `${req.protocol}://${req.get('host')}/${result.shortId}`;

        return res.status(201).json({
            shortUrl: fullShortUrl,
            message: result.message
        });
    } catch (error) {
        console.error('Error in handleCreateShortUrl:', error.message);
        return res.status(500).json({ error: 'Server error.' });
    }
}

async function redirectToLongUrl(req, res) {
    const { shortId } = req.params;
    const db = getDb();
    const urlsCollection = db.collection('urls');

    try {
        const result = await urlsCollection.findOneAndUpdate(
            { shortId: shortId },
            {
                $inc: { clicks: 1 },
                $set: { lastAccessedAt: new Date() }
            },
            { returnDocument: 'after' }
        );

        const urlDoc = result.value;

        if (urlDoc) {
            res.redirect(urlDoc.longUrl);
        } else {
            res.status(404).json({ error: 'Short URL not found.' });
        }
    } catch (error) {
        console.error('Error in redirectToLongUrl:', error.message);
        res.status(500).json({ error: 'Server error.' });
    }
}

module.exports = {
    handleCreateShortUrl,
    redirectToLongUrl
};
