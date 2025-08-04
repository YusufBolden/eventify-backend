import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private (User/Admin)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin only
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);

export default router;
