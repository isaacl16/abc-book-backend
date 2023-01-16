const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SIGNING_KEY;

const verifyUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secret);
        if (decoded.role !== 'user' && decoded.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
};

const verifyAdminEditor = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secret);
        console.log(decoded);
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
    try {
        const decoded = jwt.verify(token, secret);
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