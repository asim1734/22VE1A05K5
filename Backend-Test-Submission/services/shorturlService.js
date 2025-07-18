const shortid = require('shortid');
const { getDb } = require('../config/db');

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

    await urlsCollection.insertOne(newUrlDocument);

    return {
        shortId: newShortId,
        expiresAt: expiresAt
    };
}

module.exports = {
    createShortUrl
};
