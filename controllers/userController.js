const mongoose = require('mongoose');
const User = require('../models/User');

//Get a user by id
exports.getUser = async (req, res) => {
    await User.findById(req.params._id)
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

//Get all users
exports.getUsers = async (req, res) => {
    const { page = 1, pageSize = 10, name = null, role = null, sort = null } = req.query;
    let query = {};
    if (name) {
        query['name'] = name;
    }
    if (role) {
        query['role'] = role;
    }
    if (isNaN(page) || isNaN(pageSize)) {
        res.status(400).json({ message: 'NaN', page, pageSize });
        return;
    }
    await User.countDocuments()
        .then(async count => {
            await User.find(query)
                .sort(JSON.parse(sort))
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

//Add a new user
exports.addUser = async (req, res) => {
    const reqBody = req.body;
    const _id = new mongoose.Types.ObjectId();
    const newUser = new User({
        _id: _id,
        name: reqBody.name,
        role: reqBody.role,
    });
    await newUser.save()
        .then((user) => {
            console.log(`New user created: ${user}`);
            res.status(200).json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status || 500).json({ message: err.message });
        });
};

//Update a user by id
exports.updateUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.params._id,
        req.body,
        {
            runValidators: true, new: true
        }
    )
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

//Remove a user by id
exports.removeUser = async (req, res) => {
    await User.findByIdAndDelete(req.params._id)
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

//Remove users in batches
exports.removeUsers = async (req, res) => {
    const _ids = req.body._ids;
    await User.deleteMany(
        {
            _id: {
                $in: _ids
            }
        }
    )
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