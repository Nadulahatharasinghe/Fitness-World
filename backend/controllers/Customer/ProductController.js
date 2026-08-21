import Product from "../../models/Customer/Product.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Add new product
export const addProduct = async (req, res) => {
  const { name, price, image, category } = req.body;
  try {
    const product = new Product({ name, price, image, category });
    await product.save();
    if (!product) {
      return res.status(404).json({ message: "Unable to add product" });
    }
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, price, image, category } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, image, category },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Unable to update product" });
    }
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Unable to delete product" });
    }
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};