const shortid = require('shortid');
const { getDb } = require('../config/db');

async function createShortUrl(url) { // Removed validity, shortcode
    const db = getDb();
    const urlsCollection = db.collection('urls');

    // Basic check for existing URL
    let existingUrlDoc = await urlsCollection.findOne({ longUrl: url });
    if (existingUrlDoc) {
        return {
            shortId: existingUrlDoc.shortId,
            message: 'URL already shortened.'
        };
    }

    const newShortId = shortid.generate();

    const newUrlDocument = {
        shortId: newShortId,
        longUrl: url,
        clicks: 0, // Still good to initialize this for future analytics
        createdAt: new Date()
    };

    await urlsCollection.insertOne(newUrlDocument);

    return {
        shortId: newShortId
    };
}

module.exports = {
    createShortUrl
};
