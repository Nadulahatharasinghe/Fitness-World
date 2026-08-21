import express from 'express';
import {
  getActiveProducts,
  getProductById,
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from '../../controllers/Gym/storeProductController.js';
import { auth, adminAuth } from '../../middleware/Auth.js';

const userRouter = express.Router();
const adminRouter = express.Router();

// User Routes
userRouter.get('/', getActiveProducts);
userRouter.get('/:id', getProductById);

// Admin Routes
adminRouter.use(adminAuth);
adminRouter.get('/', adminGetAllProducts);
adminRouter.post('/', adminCreateProduct);
adminRouter.put('/:id', adminUpdateProduct);
adminRouter.delete('/:id', adminDeleteProduct);

export { userRouter as userStoreProductRouter, adminRouter as adminStoreProductRouter };
