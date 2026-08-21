import express from "express";
import {
    getAllProducts,
    addProduct,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../../controllers/Customer/ProductController.js";

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
router.get("/", getAllProducts);

// @route   POST /api/products
// @desc    Add a new product
router.post("/", addProduct);

// @route   GET /api/products/:id
// @desc    Get a product by ID
router.get("/:id", getProductById);

// @route   PUT /api/products/:id
// @desc    Update a product
router.put("/:id", updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete("/:id", deleteProduct);

export default router;