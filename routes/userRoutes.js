const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser, changeUserRole } = require('../controllers/userController');
const { authenticateUser, authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateAdmin, getAllUsers);
router.get('/:id', authenticateUser, getUserById);
router.put('/:id', authenticateUser, updateUser);
router.delete('/:id', authenticateAdmin, deleteUser);
router.patch('/:id/role', authenticateAdmin, changeUserRole);

module.exports = router;
