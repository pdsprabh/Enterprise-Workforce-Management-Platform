const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) {
            console.log('No MONGO_URI provided. Starting in-memory MongoDB server...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
