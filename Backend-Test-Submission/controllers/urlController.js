const shortid = require('shortid');
const { getDb } = require('../config/db');
const { createShortUrl } = require('../services/shorturlService');
const { log } = require('../../logging-middlware/utils/logger'); 

async function handleCreateShortUrl(req, res) {
    const { url, validity, shortcode } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
        await log('backend', 'error', 'handler', 'Invalid or missing URL in request body.');
        return res.status(400).json({ error: 'Invalid URL.' });
    }

    try {
        const result = await createShortUrl(url, validity, shortcode);
        const fullShortUrl = `${req.protocol}://${req.get('host')}/${result.shortId}`;
        await log('backend', 'info', 'controller', `Short URL created successfully: ${fullShortUrl}`);
        return res.status(201).json({
            shortUrl: fullShortUrl,
            expiresAt: result.expiresAt,
            message: result.message
        });
    } catch (error) {
        console.error('Error creating short URL:', error.message);
        const errorMessage = error.message.slice(0, 100);
        const statusCode = error.message.includes('Custom shortcode') ? 409 : 500;
        await log('backend', 'error', 'controller', `Failed to create short URL: ${errorMessage}`);
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
            await log('backend', 'warn', 'controller', `Attempted access to non-existent shortId: ${shortId}`);
            return res.status(404).json({ error: 'URL not found.' });
        }

        if (urlDoc.expiresAt && new Date() > urlDoc.expiresAt) {
            await log('backend', 'warn', 'controller', `Expired URL accessed: ${shortId}`);
            return res.status(410).json({ error: 'URL expired.' });
        }

        await urlsCollection.updateOne(
            { shortId: shortId },
            {
                $inc: { clicks: 1 },
                $set: { lastAccessedAt: new Date() }
            }
        );
        await log('backend', 'info', 'controller', `Redirected ${shortId} to ${urlDoc.longUrl}`);
        res.redirect(urlDoc.longUrl);
    } catch (error) {
        console.error('Error redirecting URL:', error.message);
        const errorMessage = error.message.slice(0, 100);
        await log('backend', 'error', 'controller', `Failed to redirect ${shortId}: ${errorMessage}`);
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
            await log('backend', 'warn', 'controller', `Analytics requested for non-existent shortId: ${shortId}`);
            return res.status(404).json({ error: 'Analytics not found for this URL.' });
        }
        await log('backend', 'info', 'controller', `Analytics retrieved for ${shortId}`);
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
        const errorMessage = error.message.slice(0, 100);
        await log('backend', 'error', 'controller', `Failed to fetch analytics for ${shortId}: ${errorMessage}`);
        res.status(500).json({ error: 'Server error fetching analytics.' });
    }
}

module.exports = {
    handleCreateShortUrl,
    redirectToLongUrl,
    getAnalytics
};
