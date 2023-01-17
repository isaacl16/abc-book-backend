const userController = require('../controllers/userController.js');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyAdminEditor, userController.getUsers);

router.post('/', authMiddleware.verifyAdmin, userController.addUser);

router.delete('/', authMiddleware.verifyAdmin, userController.removeUsers);

router.get('/:_id', authMiddleware.verifyAdminEditor, userController.getUser);

router.put('/:_id', authMiddleware.verifyAdmin, userController.updateUser);

router.delete('/:_id', authMiddleware.verifyAdmin, userController.removeUser);

module.exports = router;
