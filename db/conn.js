const mongoose = require('mongoose');
require('dotenv').config();

exports.connectToDB = (callback) => {
    mongoose.connect(process.env.REACT_APP_MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.REACT_APP_MONGODB_DBNAME
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
