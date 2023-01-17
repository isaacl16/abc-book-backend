const requestsController = require('../controllers/requestsController.js');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware.verifyAdmin, requestsController.getRequests);

router.post('/', authMiddleware.verifyAdmin, requestsController.crudRequest);

router.get('/:_id', authMiddleware.verifyAdmin, requestsController.getRequest);

router.patch('/:_id/approve', authMiddleware.verifyAdmin, requestsController.approveUserRequest);

router.patch('/:_id/reject', authMiddleware.verifyAdmin, requestsController.rejectUserRequest);

module.exports = router;
