import express from 'express';
import { getAllSupplements, createSupplement, updateSupplement, deleteSupplement } from '../../controllers/Gym/supplementController.js';
import { adminAuth } from '../../middleware/Auth.js';

const router = express.Router();

router.get('/', getAllSupplements);
router.post('/', adminAuth, createSupplement);
router.put('/:id', adminAuth, updateSupplement);
router.delete('/:id', adminAuth, deleteSupplement);

export default router;
