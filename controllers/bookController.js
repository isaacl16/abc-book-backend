const mongoose = require('mongoose');
const Book = require('../models/Book');
const { decodeToken } = require('../utils/index');

// Get book by id
exports.getBook = async (req, res) => {
    await Book.findById(req.params._id)
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

// Get books
exports.getBooks = async (req, res) => {
    const { page = 1, pageSize = 10, title = null, genre = [], author = null, year_published = null, borrowing_availability_status = null, sort = null } = req.query;
    let query = {};
    if (title) {
        query['title'] = title;
    }
    if (genre && genre.length > 0) {
        query['genre'] = {
            $in: {
                genre
            }
        };
    }
    if (author) {
        query['author'] = author;
    }
    if (year_published) {
        query['year_published'] = year_published;
    }
    if (borrowing_availability_status) {
        query['borrowing_availability_status'] = borrowing_availability_status;
    }
    if (isNaN(page) || isNaN(pageSize)) {
        return res.status(400).json({ message: 'NaN', page, pageSize });
    }
    await Book.countDocuments()
        .then(async (count) => {
            await Book.find(query)
                .sort(JSON.parse(sort))
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .then((books) => {
                    res.status(200).json({ books, count });
                })
                .catch((err) => {
                    res.status(err.status || 500).json({ message: err.message });
                });
        });
};

// Add books in batches
exports.addBook = async (req, res) => {
    const reqBody = req.body;
    const _id = new mongoose.Types.ObjectId();
    const newBook = new Book({
        _id,
        title: reqBody.title,
        description: reqBody.description ? reqBody.description : '',
        genre: reqBody.genre ? reqBody.genre : [],
        author: reqBody.author ? reqBody.author : '',
        year_published: reqBody.year_published ? reqBody.year_published : null,
    });
    await newBook.save()
        .then((book) => {
            res.status(200).json(book);
        }).catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

// Update book by id
exports.updateBook = async (req, res) => {
    await Book.findByIdAndUpdate(
        req.params._id,
        req.body,
        {
            runValidators: true,
            new: true,
        },
    )
        .then((book) => {
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        })
        .catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

// Remove book by id
exports.removeBook = async (req, res) => {
    await Book.findByIdAndDelete(req.params._id)
        .then((book) => {
            if (book) {
                res.status(200).json({ message: `${book.title} deleted` });
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        })
        .catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

// Remove books in batches
exports.removeBooks = async (req, res) => {
    const { _ids } = req.body;
    await Book.deleteMany(
        {
            _id: {
                $in: _ids,
            },
        },
    )
        .then((result) => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: `${result.deletedCount} books were deleted` });
            } else {
                res.status(404).json({ message: 'No books were found with the given ids' });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

// Borrow a book by id
exports.borrowBook = async (req, res) => {
    const { _id } = req.params;
    const decoded = decodeToken(req.headers.authorization.split(' ')[1]);
    try {
        const book = await Book.findById(_id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.borrowing_availability_status == 'available') {
            await Book.findByIdAndUpdate(
                _id,
                {
                    $set: {
                        last_borrower: decoded._id,
                        borrowing_availability_status: 'checked_out',
                    },
                },
                {
                    new: true, runValidators: true,
                },
            )
                .then((updatedBook) => {
                    res.status(200).json(updatedBook);
                });
        } else {
            return res.status(401).json({ message: 'Book unavailable' });
        }
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

// Return a book by id
exports.returnBook = async (req, res) => {
    const { _id } = req.params;
    try {
        const decoded = decodeToken(req.headers.authorization.split(' ')[1]);
        const book = await Book.findById(_id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.last_borrower == decoded._id && book.borrowing_availability_status == 'checked_out') {
            // Update the book
            await Book.findByIdAndUpdate(
                req.params._id,
                {
                    $set: {
                        last_borrower: decoded._id,
                        borrowing_availability_status: 'available',
                    },
                },
                {
                    new: true, runValidators: true,
                },
            )
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

// Borrow books in batches
exports.batchBorrowBook = async (req, res) => {
    const { _ids } = req.body;
    const decoded = decodeToken(req.headers.authorization.split(' ')[1]);
    await Book.updateMany(
        {
            _id: {
                $in: _ids,
            },
            borrowing_availability_status: 'available',
        },
        {
            $set: {
                last_borrower: decoded._id,
                borrowing_availability_status: 'checked_out',
            },
        },
    )
        .then((result) => {
            if (result.matchedCount > 0) {
                res.status(200).json({ message: `${result.matchedCount} books were borrowed` });
            } else {
                res.status(404).json({ message: 'No books were found with the given ids' });
            }
        })
        .catch((err) => {
            res.status(err.status || 500).json({ message: err.message });
        });
};

// Return books in batches
exports.batchReturnBook = async (req, res) => {
    const { _ids } = req.body;
    try {
        const decoded = decodeToken(req.headers.authorization.split(' ')[1]);
        await Book.updateMany(
            {
                _id: {
                    $in: _ids,
                },
                borrowing_availability_status: 'checked_out',
                last_borrower: decoded._id,
            },
            {
                $set: {
                    borrowing_availability_status: 'available',
                },
            },
        )
            .then((result) => {
                if (result.matchedCount > 0) {
                    res.status(200).json({ message: `${result.matchedCount} books were returned` });
                } else {
                    res.status(404).json({ message: 'No books were found with the given ids' });
                }
            });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};
