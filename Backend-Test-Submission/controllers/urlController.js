const shortid = require('shortid');
const { getDb } = require('../config/db');
const { createShortUrl } = require('../services/shorturlService');

async function handleCreateShortUrl(req, res) {
    const { url, validity, shortcode } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
        return res.status(400).json({ error: 'Invalid URL.' });
    }

    try {
        const result = await createShortUrl(url, validity, shortcode);
        const fullShortUrl = `${req.protocol}://${req.get('host')}/${result.shortId}`;
        return res.status(201).json({
            shortUrl: fullShortUrl,
            expiresAt: result.expiresAt,
            message: result.message
        });
    } catch (error) {
        console.error('Error creating short URL:', error.message);
        const statusCode = error.message.includes('Custom shortcode') ? 409 : 500;
        return res.status(statusCode).json({ error: error.message });
    }
}

async function redirectToLongUrl(req, res) {
    const { shortId } = req.params;
    const db = getDb();
    const urlsCollection = db.collection('urls');

    try {
        const urlDoc = await urlsCollection.findOne({ shortId: shortId });

        if (!urlDoc) {
            return res.status(404).json({ error: 'URL not found.' });
        }

        if (urlDoc.expiresAt && new Date() > urlDoc.expiresAt) {
            return res.status(410).json({ error: 'URL expired.' });
        }

        await urlsCollection.updateOne(
            { shortId: shortId },
            {
                $inc: { clicks: 1 },
                $set: { lastAccessedAt: new Date() }
            }
        );

        res.redirect(urlDoc.longUrl);
    } catch (error) {
        console.error('Error redirecting URL:', error.message);
        res.status(500).json({ error: 'Server error.' });
    }
}

async function getAnalytics(req, res) {
    const { shortId } = req.params;
    const db = getDb();
    const urlsCollection = db.collection('urls');

    try {
        const urlDoc = await urlsCollection.findOne({ shortId: shortId });

        if (!urlDoc) {
            return res.status(404).json({ error: 'Analytics not found for this URL.' });
        }

        return res.status(200).json({
            shortId: urlDoc.shortId,
            longUrl: urlDoc.longUrl,
            clicks: urlDoc.clicks,
            createdAt: urlDoc.createdAt,
            expiresAt: urlDoc.expiresAt || null,
            lastAccessedAt: urlDoc.lastAccessedAt || null
        });
    } catch (error) {
        console.error('Error fetching analytics:', error.message);
        res.status(500).json({ error: 'Server error fetching analytics.' });
    }
}

module.exports = {
    handleCreateShortUrl,
    redirectToLongUrl,
    getAnalytics // Export the new analytics function
};