const Book = require('../models/Book');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SIGNING_KEY;

exports.getBook = (req, res) => {
    Book.findById(req.params._id)
        .then((book) => {
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        }).catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.getBooks = (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    if (isNaN(page) || isNaN(pageSize)) {
        return res.status(400).json({ message: 'NaN', page, pageSize });
    }
    Book.countDocuments()
        .then(count => {
            Book.find()
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .then(books => {
                    res.status(200).json({ books, count });
                })
                .catch((err) => {
                    res.status(err.status || 500).json({ message: err.message });
                });
        });
};


exports.addBooks = (req, res) => {
    const reqBody = req.body;
    const _id = new mongoose.Types.ObjectId();
    const newBook = new Book({
        _id: _id,
        title: reqBody.title,
        description: reqBody.description ? reqBody.description : '',
        genre: reqBody.genre ? reqBody.genre : [],
        author: reqBody.author ? reqBody.author : '',
        year_published: reqBody.year_published ? reqBody.year_published : null,
    });
    newBook.save()
        .then((book) => {
            res.status(200).json(book);
        }).catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.updateBook = (req, res) => {
    Book.findByIdAndUpdate(req.params._id, req.body, { runValidators: true, new: true })
        .then(book => {
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        })
        .catch(err => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.removeBook = (req, res) => {
    Book.findByIdAndDelete(req.params._id)
        .then((book) => {
            if (book) {
                res.status(200).json({ message: `${book.title} deleted` });
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        })
        .catch(err => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.removeBooks = (req, res) => {
    const _ids = req.body._ids;
    Book.deleteMany({ _id: { $in: _ids } })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: `${result.deletedCount} books were deleted` });
            } else {
                res.status(404).json({ message: 'No books were found with the given ids' });
            }
        })
        .catch(err => {
            res.status(400).json({ message: err.message });
        });
};

exports.borrowBook = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secret);
    Book.findByIdAndUpdate(req.params._id, {
        $set: { last_borrower: decoded._id, borrowing_availability_status: 'checked_out' }
    }, { new: true, runValidators: true })
        .then((updatedBook) => {
            res.status(200).json(updatedBook);
        })
        .catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });

};

exports.returnBook = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const _id = req.params._id;
    try {
        const decoded = jwt.verify(token, secret);
        const book = await Book.findById(_id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.last_borrower == decoded._id) {
            // Update the book
            Book.findByIdAndUpdate(req.params._id, {
                $set: { last_borrower: decoded._id, borrowing_availability_status: 'available' }
            }, { new: true, runValidators: true })
                .then((updatedBook) => {
                    res.status(200).json(updatedBook);
                });
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.batchBorrowBook = (req, res) => {

};

exports.batchReturnBook = (req, res) => {

};