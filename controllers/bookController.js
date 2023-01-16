const Book = require('../models/Book');
const mongoose = require('mongoose');

exports.getBook = async (req, res) => {
    Book.findById(req.params._id)
        .then((book) => {
            res.status(200).json(book);
        }).catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

exports.getBooks = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
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


exports.addBooks = async (req, res) => {
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

exports.updateBook = async (req, res) => {

};

exports.updateBooks = async (req, res) => {

};

exports.removeBook = async (req, res) => {

};

exports.removeBooks = async (req, res) => {

};

exports.borrowBook = async (req, res) => {

};

exports.returnBook = async (req, res) => {

};

exports.batchBorrowBook = async (req, res) => {

};

exports.batchReturnBook = async (req, res) => {

};