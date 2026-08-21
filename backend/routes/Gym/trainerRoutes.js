import express from 'express';
import { getAllTrainers, getTrainerById, createTrainer, updateTrainer, deleteTrainer } from '../../controllers/Gym/trainerController.js';
import { auth, adminAuth } from '../../middleware/Auth.js';

const router = express.Router();

router.get('/', getAllTrainers);
router.get('/:id', getTrainerById);
router.post('/', adminAuth, createTrainer);
router.put('/:id', adminAuth, updateTrainer);
router.delete('/:id', adminAuth, deleteTrainer);

export default router;
