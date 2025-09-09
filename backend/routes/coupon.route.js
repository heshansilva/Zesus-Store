import express from 'express';
import { protectRoute, validateCoupon} from '../middleware/auth.middleware.js';


const router = express.Router();

router.get("/", protectRoute, getCoupon); // Get coupon details
router.get("/validate", protectRoute, validateCoupon); // Validate a coupon code  
export default router;