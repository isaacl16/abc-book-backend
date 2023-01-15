const booksController = require('../controllers/booksController.js');
const express = require('express');
const router = express.Router();

router.get('/:_id', booksController.getBook);

router.get('/', booksController.getBooks);

router.post('/', booksController.addBooks);

router.put('/:_id', booksController.updateBook);

router.patch('/:_id', booksController.updateBook);

router.delete('/', booksController.removeBooks);

router.delete('/:_id', booksController.removeBook);

module.exports = router;



