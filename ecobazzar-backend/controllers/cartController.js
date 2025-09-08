const Cart = require('../models/Cart');



// Add a product to the user's cart

// ecobazzar-backend/controllers/cartController.js
exports.addItemToCart = async (req, res) => {
    try {
        // ⚠️ FIX: Change productId to product_id to match the JSON body key
        const { product_id, quantity } = req.body; 
        const userId = req.user.userId;

        // ... now pass the correct variable name
        const cartId = await Cart.findOrCreateByUserId(userId);
        const status = await Cart.addItem(cartId, product_id, quantity); // ⚠️ Change to product_id

        if (status === 'created') {
            res.status(201).json({ message: 'Product added to cart successfully' });
        } else {
            res.status(200).json({ message: 'Product quantity updated in cart' });
        }
    } catch (error) {
        // ...
    }
};



// Get the user's cart items

exports.getCartItems = async (req, res) => {

  try {

    const userId = req.user.userId;

    const cartId = await Cart.findOrCreateByUserId(userId);

    const cartItems = await Cart.getItems(cartId);

    res.status(200).json(cartItems);

  } catch (error) {

    console.error('Error getting cart items:', error);

    res.status(500).json({ message: 'Server error' });

  }

};



// Remove a product from the user's cart

exports.removeItemFromCart = async (req, res) => {

  try {

    const { productId } = req.params;

    const userId = req.user.userId;



    const cartId = await Cart.findOrCreateByUserId(userId);

    const affectedRows = await Cart.removeItem(cartId, productId);



    if (affectedRows === 0) {

      return res.status(404).json({ message: 'Product not found in cart' });

    }

    res.status(200).json({ message: 'Product removed from cart successfully' });

  } catch (error) {

    console.error('Error removing item from cart:', error);

    res.status(500).json({ message: 'Server error' });

  }

};