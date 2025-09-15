import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get("/", protectRoute, adminRoute, async(req, res) =>{
    try {
        const analyticsData = await getAnalyticsData(); //Calls a helper function that collects data from the database

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); //today → 7 days back

        const dailySaleData = await getDailySalesData(startDate, endDate);

        res.json({
            analyticsData,
            dailySaleData
        })
    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({message: "server error", error: error.message});

    }
})

export default router;