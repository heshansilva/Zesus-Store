import express from 'express';
import { getCartProducts, addToCart, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const route = express.Router();

route.get('/', protectRoute, getCartProducts); // Get cart items for the authenticated user
route.post('/', protectRoute, addToCart); // Add item to cart
route.delete('/', protectRoute, removeAllFromCart); // Remove all items from cart
route.put('/', protectRoute, updateQuantity); // Update item quantity in cart

export default route;
// route used to handle cart-related operations such as adding, removing, and updating items in the cart for authenticated users