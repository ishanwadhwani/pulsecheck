const express = require('express');
const router = express.Router();
const CheckController = require('../controllers/checkController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/checks
// @desc    Create a new check for the logged-in user
// @access  Private
router.post('/', authMiddleware, CheckController.createCheck);

// @route   GET /api/checks
// @desc    Get all checks for the logged-in user
// @access  Private
router.get('/', authMiddleware, CheckController.getUserChecks);

router.get('/:checkId/logs', authMiddleware, CheckController.getCheckLogs);

router.delete('/:checkId', authMiddleware, CheckController.deleteCheck);

router.put('/:checkId', authMiddleware, CheckController.updateCheck);

module.exports = router;