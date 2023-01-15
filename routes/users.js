const usersController = require('../controllers/usersController.js');
const express = require('express');
const router = express.Router();

router.get('/:_id', usersController.getUser);

router.get('/', usersController.getUsers);

router.post('/', usersController.addUser);

router.put('/', usersController.updateUser);

router.delete('/:_id', usersController.removeUser);

router.delete('/', usersController.removeUsers);

module.exports = router;
