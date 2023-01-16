const Book = require('../models/Book');
const mongoose = require('mongoose');

exports.getBook = (req, res) => {
    Book.findById(req.params._id)
        .then((book) => {
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: 'Item not found' });
            }
        }).catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.getBooks = (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    if (isNaN(page) || isNaN(pageSize)) {
        res.status(400).json({ message: 'NaN', page, pageSize });
        return;
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
                res.status(404).json({ message: 'Item not found' });
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
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: 'Item not found' });
            }
        })
        .catch(err => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.removeBooks = (req, res) => {

};

exports.borrowBook = (req, res) => {

};

exports.returnBook = (req, res) => {

};

exports.batchBorrowBook = (req, res) => {

};

exports.batchReturnBook = (req, res) => {

};