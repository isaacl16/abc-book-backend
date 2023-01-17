const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SIGNING_KEY;

const verifyUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        //pretend we verify with database if user token is valid
        if (decoded.role !== 'member' && decoded.role !== 'editor' && decoded.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
    } catch (err) {
        console.log('here');
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
};

const verifyAdminEditor = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        //pretend we verify with database if user token is valid
        if (decoded.role !== 'admin' && decoded.role !== 'editor') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
};

const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        //pretend we verify with database if user token is valid
        if (decoded.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
};

module.exports = {
    verifyAdmin,
    verifyAdminEditor,
    verifyUser,
};