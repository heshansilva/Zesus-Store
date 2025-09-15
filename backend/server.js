//const express = require('express');
import express from 'express'; //importing the Express framework. Express is a library that makes it easier to build APIs or web apps in Node.js.
import dotenv from 'dotenv'; //importing the dotenv package, which allows you to load environment variables from a .env file into process.env.
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.route.js"; //importing the auth routes from a separate file.
import productRoutes from "./routes/product.route.js"; //importing the product routes from a separate file.
import cartRouters from "./routes/cart.route.js"; //importing the cart routes from a separate file.
import couponRouters from "./routes/coupon.route.js"; //importing the coupon routes from a separate file.
import paymentRoutes from "./routes/payment.route.js"; //importing the payment routes from a separate file.
import analyticsRoutes from "./routes/analytics.route.js"; //importing the analytics routes from a separate file. 

import { connectDB } from './lib/db.js'; //importing db


dotenv.config(); //calling the config method to load the variables
const app = express();

app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use(express.json()); // allows you to parse body of the requests

//authentication
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRouters);
app.use('/api/coupons', couponRouters);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // Connect to MongoDB
  connectDB();
});
