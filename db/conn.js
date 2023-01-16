const mongoose = require('mongoose');
require('dotenv').config();

exports.connectToDB = (callback) => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.MONGODB_DBNAME
    });
    const conn = mongoose.connection;
    conn.on('error', () => {
        console.error.bind(console, 'connection error');
        process.exit();
    });
    conn.once('open', () => {
        console.info('Connection to Database is successful');
        return callback();
    });

};
