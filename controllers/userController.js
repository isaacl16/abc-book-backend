const mongoose = require('mongoose');
const User = require('../models/User');

exports.getUser = (req, res) => {
    User.findById(req.params._id)
        .then((user) => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.getUsers = (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
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

exports.addUser = (req, res) => {
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

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(req.params._id, req.body, { runValidators: true, new: true })
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.removeUser = (req, res) => {
    User.findByIdAndDelete(req.params._id)
        .then((user) => {
            if (user) {
                res.status(200).json({ message: `${user.name} deleted` });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.removeUsers = (req, res) => {
    const _ids = req.body._ids;
    User.deleteMany({ _id: { $in: _ids } })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: `${result.deletedCount} users were deleted` });
            } else {
                res.status(404).json({ message: 'No users were found with the given ids' });
            }
        })
        .catch(err => {
            res.status(400).json({ message: err.message });
        });
};