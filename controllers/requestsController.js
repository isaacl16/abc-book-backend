const mongoose = require('mongoose');
const Request = require('../models/Request');
const { decodeToken } = require('../utils/index');
const conn = require('../db/conn');
const User = require('../models/User');

exports.getRequest = (req, res) => {
    Request.findById(req.params._id)
        .then((request) => {
            if (request) {
                res.status(200).json(request);
            } else {
                res.status(404).json({ message: 'Request not found' });
            }
        })
        .catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.getRequests = (req, res) => {
    const { page = 1, pageSize = 10, status = null } = req.query;
    let query;
    if (status) {
        query = { status: status };
    } else {
        query = {};
    }
    if (isNaN(page) || isNaN(pageSize)) {
        res.status(400).json({ message: 'NaN', page, pageSize });
        return;
    }
    console.log(page + ' ' + pageSize);
    Request.countDocuments()
        .then(count => {
            Request.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .then(requests => {
                    res.status(200).json({ requests, count });
                })
                .catch((err) => {
                    res.status(err.status || 500).json({ message: err.message });
                });
        });
};

exports.crudRequest = async (req, res) => {
    const reqBody = req.body;
    const _id = new mongoose.Types.ObjectId();
    const decode = decodeToken(req.headers.authorization.split(' ')[1]);
    const requestObject = {
        _id: _id,
        name: reqBody.name,
        role: reqBody.role,
        action: reqBody.action,
        created_by: decode.name
    };
    if (reqBody.action !== 'add') {
        if (!reqBody.user_id) {
            return res.status(401).json({ message: 'missing user_id' });
        }
        requestObject['user_id'] = reqBody.user_id;
    }
    const newRequest = new Request({
        ...requestObject
    });

    newRequest.save()
        .then((request) => {
            console.log(`New request created: ${request}`);
            res.status(200).json(request);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status || 500).json({ message: err.message });
        });
};

// exports.updateUserRequest = (req, res) => {
//     User.findByIdAndUpdate(req.params._id, req.body, { runValidators: true, new: true })
//         .then(user => {
//             if (user) {
//                 res.status(200).json(user);
//             } else {
//                 res.status(404).json({ message: 'User not found' });
//             }
//         })
//         .catch(err => {
//             res.status(err.status || 500).json({ message: err.message });
//         });
// };

// exports.removeUserRequest = (req, res) => {
//     User.findByIdAndDelete(req.params._id)
//         .then((user) => {
//             if (user) {
//                 res.status(200).json({ message: `${user.name} deleted` });
//             } else {
//                 res.status(404).json({ message: 'User not found' });
//             }
//         })
//         .catch(err => {
//             res.status(err.status || 500).json({ message: err.message });
//         });
// };

exports.approveRequest = async (req, res) => {
    const { _id } = req.params;
    const decode = decodeToken(req.headers.authorization.split(' ')[1]);

    let session = await conn.startSession();

    try {
        session.startTransaction();
        let request = await Request.findById(_id);
        if (!request) {
            res.status(404).json({ message: 'Request not found' });
        }
        else if (request.status === 'pending') {
            request = await Request.findByIdAndUpdate(
                _id,
                {
                    $set: { status: 'approved', validated_by: decode.name }
                },
                { new: true }
            );
            if (request.action === 'update') {
                const user = await User.findByIdAndUpdate(
                    request.user_id,
                    {
                        $set: {
                            name: request.name,
                            role: request.role,
                        }
                    },
                    { new: true }
                );
                if (!user) {
                    await session.abortTransaction();
                    res.status(404).json({ message: 'User not found' });
                } else {
                    res.status(200).json({ request: request, user: user });
                }
            } else if (request.action === 'add') {
                const _id = new mongoose.Types.ObjectId();
                const newUser = new User({
                    _id: _id,
                    name: request.name,
                    role: request.role,
                });
                const user = await newUser.save()
                    .then((user) => {
                        console.log(`New user created: ${user}`);
                        res.status(200).json(user);
                    });
                res.status(200).json(user);
            } else if (request.action === 'remove') {
                const user = await User.findByIdAndDelete(request.user_id);
                if (!user) {
                    await session.abortTransaction();
                    res.status(404).json({ message: 'User not found' });
                } else {
                    res.status(200).json({ message: `${user.name} has been deleted` });
                }
            }
        } else {
            res.status(401).json({ message: 'Request has already been approved/rejected' });
        }
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        res.status(err.status || 500).json({ message: err.message });
    }
    session.endSession();
};

exports.rejectRequest = (req, res) => {

};