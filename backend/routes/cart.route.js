import express from 'express';
import { getCartProducts, addToCart, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const route = express.Router();

route.get('/', protectRoute, getCartProducts);
route.post('/', protectRoute, addToCart);
route.delete('/', protectRoute, removeAllFromCart);
route.put('/', protectRoute, updateQuantity);

export default route;
