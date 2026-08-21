import express from 'express';
import { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan } from '../../controllers/Gym/planController.js';
import { adminAuth } from '../../middleware/Auth.js';

const router = express.Router();

router.get('/', getAllPlans);
router.get('/:id', getPlanById);
router.post('/', adminAuth, createPlan);
router.put('/:id', adminAuth, updatePlan);
router.delete('/:id', adminAuth, deletePlan);

export default router;
