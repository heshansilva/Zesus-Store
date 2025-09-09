import express from 'express';
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, getProductByCategory, toggleFeaturedProduct} from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';
import { GetRangeCommand } from '@upstash/redis';

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts); // Admin-only route to get all products
router.get('/featured', getFeaturedProducts); // Public route for featured products
router.get('/recommendations', getRecommendedProducts); // Public route for recommended products
router.get('/category/:category', getProductByCategory); // Public route for products by category
router.post('/', protectRoute, adminRoute, createProduct); // Route for creating a new product
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct); // Route for toggling featured status
router.delete('/:id', protectRoute, adminRoute, deleteProduct); // Route for deleting a product

export default router;  