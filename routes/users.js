const userController = require('../controllers/userController.js');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:_id', authMiddleware.verifyAdminEditor, userController.getUser);

router.get('/', authMiddleware.verifyAdminEditor, userController.getUsers);

router.post('/', authMiddleware.verifyAdmin, userController.addUser);

router.put('/', authMiddleware.verifyAdmin, userController.updateUser);

router.delete('/:_id', authMiddleware.verifyAdmin, userController.removeUser);

router.delete('/', authMiddleware.verifyAdmin, userController.removeUsers);

module.exports = router;
