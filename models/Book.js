const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
    },
    genre: [
        {
            type: String,
        }
    ],
    author: {
        type: String,
        index: true
    },
    year_published: {
        type: Number,
        index: true
    },
    borrowing_availability_status: {
        type: String,
        enum: ['available', 'checked_out'],
        default: 'available',
    },
    last_borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
});

module.exports = mongoose.model('Book', bookSchema);