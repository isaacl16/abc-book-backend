const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String },
    role: {
        type: String,
        enum: ['admin', 'editor', 'member'],
        default: 'member'
    },
    date_joined: { type: Date },
});

module.exports = mongoose.model('Book', userSchema);