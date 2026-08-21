import StoreProduct from '../../models/Gym/StoreProduct.js';

// User: get all active products
export const getActiveProducts = async (req, res) => {
  try {
    const products = await StoreProduct.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products.', error: error.message });
  }
};

// User/Admin: get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await StoreProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details.', error: error.message });
  }
};

// Admin: get all products (including inactive)
export const adminGetAllProducts = async (req, res) => {
  try {
    const products = await StoreProduct.find({}).sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin products.', error: error.message });
  }
};

// Admin: create product
export const adminCreateProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, image, benefits } = req.body;
    
    // benefits can be sent as an array or comma-separated string
    let parsedBenefits = [];
    if (benefits) {
      parsedBenefits = Array.isArray(benefits) 
        ? benefits 
        : benefits.split(',').map(b => b.trim()).filter(Boolean);
    }

    const product = new StoreProduct({
      name,
      category,
      description,
      price,
      stock,
      image: image || '',
      benefits: parsedBenefits
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully.', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product.', error: error.message });
  }
};

// Admin: update product
export const adminUpdateProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, image, benefits, isActive } = req.body;
    
    const product = await StoreProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (image !== undefined) product.image = image;
    if (isActive !== undefined) product.isActive = isActive;
    
    if (benefits !== undefined) {
      product.benefits = Array.isArray(benefits) 
        ? benefits 
        : benefits.split(',').map(b => b.trim()).filter(Boolean);
    }

    await product.save();
    res.json({ message: 'Product updated successfully.', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product.', error: error.message });
  }
};

// Admin: delete product (toggle isActive)
export const adminDeleteProduct = async (req, res) => {
  try {
    const product = await StoreProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deactivated successfully (set to inactive).' });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating product.', error: error.message });
  }
};
