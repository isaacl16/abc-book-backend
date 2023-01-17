const mongoose = require('mongoose');
const Request = require('../models/Request');
const { decodeToken } = require('../utils/index');

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
    const { page = 1, pageSize = 10, status } = req.query;
    if (isNaN(page) || isNaN(pageSize)) {
        res.status(400).json({ message: 'NaN', page, pageSize });
        return;
    }
    console.log(page + ' ' + pageSize);
    Request.countDocuments()
        .then(count => {
            Request.find({ status: status ? status : null })
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

exports.crudRequest = (req, res) => {
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

exports.approveUserRequest = (req, res) => {
    const { _id } = req.params;
    const request = Request.findById(_id);
    console.log(request);
};

exports.rejectUserRequest = (req, res) => {

};