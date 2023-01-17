const bookController = require('../controllers/bookController.js');
const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/', authMiddleware.verifyUser, bookController.getBooks);

router.post('/', authMiddleware.verifyAdminEditor, bookController.addBook);

router.delete('/', authMiddleware.verifyAdminEditor, bookController.removeBooks);

router.patch('/borrowBook', authMiddleware.verifyUser, bookController.batchBorrowBook);

router.patch('/returnBook', authMiddleware.verifyUser, bookController.batchReturnBook);

router.delete('/:_id', authMiddleware.verifyAdminEditor, bookController.removeBook);

router.get('/:_id', authMiddleware.verifyUser, bookController.getBook);

router.put('/:_id', authMiddleware.verifyAdminEditor, bookController.updateBook);

router.patch('/:_id/borrowBook', authMiddleware.verifyUser, bookController.borrowBook);

router.patch('/:_id/returnBook', authMiddleware.verifyUser, bookController.returnBook);

module.exports = router;



