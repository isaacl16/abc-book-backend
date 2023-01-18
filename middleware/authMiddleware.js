const { decodeToken } = require('../utils/index');

//Verify any user of the system
const verifyUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const decoded = decodeToken(token);
        //pretend we have already verified token is valid
        if (decoded.role !== 'member' && decoded.role !== 'editor' && decoded.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
};

//Verify Admin and Editor users
const verifyAdminEditor = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const decoded = decodeToken(token);
        //pretend we have already verified token is valid
        if (decoded.role !== 'admin' && decoded.role !== 'editor') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
};

//Verify Admin
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const decoded = decodeToken(token);
        //pretend we have already verified token is valid
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