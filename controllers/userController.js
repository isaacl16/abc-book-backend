const mongoose = require('mongoose');
const User = require('../models/User');

exports.getUser = async (req, res) => {
    User.findById(req.params._id)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.getUsers = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    if (isNaN(page) || isNaN(pageSize)) {
        res.status(400).json({ message: 'NaN', page, pageSize });
        return;
    }
    User.countDocuments()
        .then(count => {
            User.find()
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .then(users => {
                    res.status(200).json({ users, count });
                })
                .catch((err) => {
                    res.status(err.status || 500).json({ message: err.message });
                });
        });
};

exports.addUser = async (req, res) => {
    const reqBody = req.body;
    const _id = new mongoose.Types.ObjectId();
    const newUser = new User({
        _id: _id,
        name: reqBody.name,
        role: reqBody.role,
    });
    newUser.save()
        .then((user) => {
            console.log(`New user created: ${user}`);
            res.status(200).json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.updateUser = async (req, res) => {

};

exports.removeUser = async (req, res) => {

};

exports.removeUsers = async (req, res) => {

};