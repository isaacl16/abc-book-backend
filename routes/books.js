const bookController = require('../controllers/bookController.js');
const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/:_id', authMiddleware.verifyUser, bookController.getBook);

router.get('/', authMiddleware.verifyUser, bookController.getBooks);

router.post('/', authMiddleware.verifyAdminEditor, bookController.addBooks);

router.put('/:_id', authMiddleware.verifyAdminEditor, bookController.updateBook);

router.patch('/:_id', authMiddleware.verifyAdminEditor, bookController.updateBook);

router.delete('/', authMiddleware.verifyAdminEditor, bookController.removeBooks);

router.delete('/:_id', authMiddleware.verifyAdminEditor, bookController.removeBook);

router.post('/:_id/borrowbook', authMiddleware.verifyUser, bookController.borrowBook);

router.post('/borrowbook', authMiddleware.verifyUser, bookController.batchBorrowBook);

router.post('/:_id/returnBook', authMiddleware.verifyUser, bookController.returnBook);

router.post('/returnBook', authMiddleware.verifyUser, bookController.batchReturnBook);

module.exports = router;



