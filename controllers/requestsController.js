const mongoose = require('mongoose');
const Request = require('../models/Request');
const { decodeToken } = require('../utils/index');
const conn = require('../db/conn');
const User = require('../models/User');

// Get a request by id
exports.getRequest = async (req, res) => {
    await Request.findById(req.params._id)
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

// Get requests
exports.getRequests = async (req, res) => {
    const { page = 1, pageSize = 10, filter = null, sort = null } = req.query;
    const filterObject = JSON.parse(filter);
    let query = {};
    if (filterObject.status) {
        query['status'] = filterObject.status;
    }
    if (filterObject.action) {
        query['action'] = filterObject.action;
    }
    if (filterObject.role) {
        query['role'] = filterObject.role;
    }
    if (filterObject.created_by) {
        query['created_by'] = filterObject.created_by;
    }
    if (filterObject.validated_by) {
        query['validated_by'] = filterObject.validated_by;
    }
    if (filterObject.name) {
        query['name'] = filterObject.name;
    }
    if (isNaN(page) || isNaN(pageSize)) {
        res.status(400).json({ message: 'NaN', page, pageSize });
        return;
    }
    await Request.countDocuments()
        .then(async (count) => {
            await Request.find(query)
                .sort(JSON.parse(sort))
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .then((requests) => {
                    res.status(200).json({ requests, count });
                })
                .catch((err) => {
                    res.status(err.status || 500).json({ message: err.message });
                });
        });
};

// Create a new request
exports.crudRequest = async (req, res) => {
    const reqBody = req.body;
    const _id = new mongoose.Types.ObjectId();
    const decode = decodeToken(req.headers.authorization.split(' ')[1]);
    const requestObject = {
        _id: _id,
        name: reqBody.name,
        role: reqBody.role,
        action: reqBody.action,
        created_by: decode.name,
    };
    if (reqBody.action !== 'add') {
        if (!reqBody.user_id) {
            return res.status(401).json({ message: 'missing user_id' });
        }
        requestObject['user_id'] = reqBody.user_id;
    }
    const newRequest = new Request({
        ...requestObject,
    });

    await newRequest.save()
        .then((request) => {
            res.status(200).json(request);
        })
        .catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

// Approve a request and perform one of the following: add, remove, update
exports.approveRequest = async (req, res) => {
    const { _id } = req.params;
    const decode = decodeToken(req.headers.authorization.split(' ')[1]);
    const session = await conn.startSession();

    try {
        session.startTransaction();
        let request = await Request.findById(_id);
        if (!request) {
            res.status(404).json({ message: 'Request not found' });
        } else if (request.created_by === decode.name) {
            res.status(401).json({ message: 'Request needs to be validated by another admin' });
        } else if (request.status === 'pending') {
            request = await Request.findByIdAndUpdate(
                _id,
                {
                    $set: { status: 'approved', validated_by: decode.name },
                },
                { new: true },
            );
            if (request.action === 'update') {
                const user = await User.findByIdAndUpdate(
                    request.user_id,
                    {
                        $set: {
                            name: request.name,
                            role: request.role,
                        },
                    },
                    { new: true },
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

// Reject a request
exports.rejectRequest = async (req, res) => {
    const { _id } = req.params;
    const decode = decodeToken(req.headers.authorization.split(' ')[1]);
    await Request.findByIdAndUpdate(
        _id,
        {
            $set: { status: 'rejected', validated_by: decode.name },
        },
        { new: true },
    ).then((request) => {
        if (request) {
            res.status(200).json(request);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    }).catch((err) => {
        res.status(err.status || 500).json({ message: err.message });
    });
};
