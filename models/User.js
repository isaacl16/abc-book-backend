const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'member'],
        default: 'member'
    },
    date_joined: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);