const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./User');

const request = new Schema({
    _id: Schema.Types.ObjectId,
    action: {
        type: String,
        enum: ['add', 'remove', 'update'],
        required: true
    },
    name: {
        type: String,
        validate: {
            validator: async function (value) {
                if (!value) {
                    return false;
                }
                const user = await User.findOne({ name: value });
                if (this.action === 'add') {
                    if (user) {
                        return false;
                    }
                    return true;
                } else if (this.action === 'update') {
                    if (!user._id.equals(this.user_id)) {
                        return false;
                    }
                    return true;
                } else {
                    if (!user) {
                        return false;
                    }
                    return true;
                }

            },
            message: 'user already exists'
        },
        index: true
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'member'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [
            function () {
                return this.action !== 'add';
            },
            'user_id is required if action is update or remove'
        ],
        default: null
    },
    created_by: {
        type: String,
        required: true,
        index: true
    },
    validated_by: {
        type: String,
        default: null,
        index: true,
    },
    date_created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', request);