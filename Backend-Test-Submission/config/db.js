const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb://localhost:27017';
const dbName = 'urlshortener';
const client = new MongoClient(mongoURI);
let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('MongoDB Connected Successfully to:', dbName);
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message);
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not connected. Call connectDB first.');
    }
    return db;
};

module.exports = { connectDB, getDb };