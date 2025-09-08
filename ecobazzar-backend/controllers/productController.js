const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new product (protected, for sellers)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, carbon_value, image_url, stock } = req.body;
    const sellerId = req.user.userId;

    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Please provide all required product fields' });
    }

    const newProductId = await Product.create(
      sellerId,
      name,
      description,
      price,
      carbon_value,
      image_url,
      stock
    );

    res.status(201).json({ message: 'Product created successfully', productId: newProductId });
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error getting product by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an existing product (protected, for sellers)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const updatePayload = req.body;

        const affectedRows = await Product.update(id, userId, updatePayload);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found or not owned by user' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search and filter products
exports.searchProducts = async (req, res) => {
    try {
        const { searchTerm, maxCarbonValue } = req.query;
        const products = await Product.searchAndFilter(searchTerm, maxCarbonValue);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a product (protected, for sellers)
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const sellerId = req.user.userId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        if (product.seller_id !== sellerId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this product' });
        }

        const affectedRows = await Product.delete(productId);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};