import express from 'express';
import {
  createStoreOrder,
  getMyStoreOrders,
  adminGetAllStoreOrders,
  adminApproveStoreOrder,
  adminRejectStoreOrder,
  adminUpdateOrderStatus
} from '../../controllers/Gym/storeOrderController.js';
import { auth, adminAuth } from '../../middleware/Auth.js';
import { uploadSlip } from '../../middleware/upload.js';

const userRouter = express.Router();
const adminRouter = express.Router();

// User Routes
userRouter.use(auth);
userRouter.post('/', uploadSlip.single('paymentSlip'), createStoreOrder);
userRouter.get('/my', getMyStoreOrders);

// Admin Routes
adminRouter.use(adminAuth);
adminRouter.get('/', adminGetAllStoreOrders);
adminRouter.put('/:id/approve', adminApproveStoreOrder);
adminRouter.put('/:id/reject', adminRejectStoreOrder);
adminRouter.put('/:id/status', adminUpdateOrderStatus);

export { userRouter as userStoreOrderRouter, adminRouter as adminStoreOrderRouter };
