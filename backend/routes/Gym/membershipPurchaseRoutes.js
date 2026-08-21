import express from 'express';
import {
  applyForMembership,
  getMyMemberships,
  adminGetAllMemberships,
  adminGetMembershipById,
  adminApproveMembership,
  adminRejectMembership,
  adminUpdateMessage
} from '../../controllers/Gym/membershipPurchaseController.js';
import { auth, adminAuth } from '../../middleware/Auth.js';
import { uploadSlip } from '../../middleware/upload.js';

const userRouter = express.Router();
const adminRouter = express.Router();

// User Routes (require general auth)
userRouter.use(auth);
userRouter.post('/apply', uploadSlip.single('paymentSlip'), applyForMembership);
userRouter.get('/my', getMyMemberships);

// Admin Routes (require admin auth)
adminRouter.use(adminAuth);
adminRouter.get('/', adminGetAllMemberships);
adminRouter.get('/:id', adminGetMembershipById);
adminRouter.put('/:id/approve', adminApproveMembership);
adminRouter.put('/:id/reject', adminRejectMembership);
adminRouter.put('/:id/message', adminUpdateMessage);

export { userRouter as userMembershipRouter, adminRouter as adminMembershipRouter };
