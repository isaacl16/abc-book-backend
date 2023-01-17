const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SIGNING_KEY;

exports.decodeToken = (token) => {
    return jwt.verify(token, secret);
};