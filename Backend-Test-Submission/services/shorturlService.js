const shortid = require('shortid');
const { getDb } = require('../config/db');
const { log } = require('../../logging-middlware/utils/logger'); 

async function createShortUrl(url, validity, customShortcode) {
    const db = getDb();
    const urlsCollection = db.collection('urls');

    const defaultValidityMinutes = 30;
    const validityMinutes = typeof validity === 'number' && validity > 0 ? validity : defaultValidityMinutes;
    const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);

    let newShortId;
    if (customShortcode && typeof customShortcode === 'string' && customShortcode.trim()) {
        const existingCustomShortcode = await urlsCollection.findOne({ shortId: customShortcode });
        if (existingCustomShortcode) {
            await log('backend', 'warn', 'service', `Custom shortcode '${customShortcode}' already in use.`);
            throw new Error(`Custom shortcode '${customShortcode}' is already in use.`);
        }
        newShortId = customShortcode;
    } else {
        newShortId = shortid.generate();
    }

    const newUrlDocument = {
        shortId: newShortId,
        longUrl: url,
        clicks: 0,
        createdAt: new Date(),
        expiresAt: expiresAt
    };

    try {
        await urlsCollection.insertOne(newUrlDocument);
        await log('backend', 'info', 'service', `URL shortened: ${url} to ${newShortId}`);
    } catch (error) {
        await log('backend', 'error', 'service', `Failed to insert URL ${url}: ${error.message}`);
        throw error;
    }

    return {
        shortId: newShortId,
        expiresAt: expiresAt
    };
}

module.exports = {
    createShortUrl
};
