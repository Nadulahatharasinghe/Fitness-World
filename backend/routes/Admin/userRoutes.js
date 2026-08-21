import express from 'express';
import {
  forgotPassword,
  resetPassword,
  updateProfile,
  updateProfilePicture,
  changePassword,
  getAllUsers,
  deleteUser,
  deactivateUser,
  getUserById
} from '../../controllers/Admin/userController.js';
import { auth, adminAuth } from '../../middleware/Auth.js';
import { uploadProfileImage } from '../../middleware/upload.js';

const router = express.Router();

// Public routes for password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes - require authentication for everything below
router.use(auth);

// User profile routes
router.get('/profile', (req, res) => {
  // user was loaded in auth middleware
  return res.json({ user: req.user });
});
router.put('/profile', updateProfile);
// Accept either JSON body { profilePicture: 'https://...' } or multipart/form-data with field 'profilePictureFile'
router.put('/profile/picture', uploadProfileImage.single('profilePictureFile'), updateProfilePicture);
router.put('/profile/password', changePassword);

// Admin routes
router.get('/all', adminAuth, getAllUsers);
router.delete('/:id', adminAuth, deleteUser);
router.put('/:id/deactivate', adminAuth, deactivateUser);

// Get user by ID (for viewing other profiles)
router.get('/:id', getUserById);

export default router;
