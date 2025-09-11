
import { stripe } from "../utils/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import {stripe} from "../utils/stripe.js";

// Create a Stripe Checkout Session
export const createCheckoutSession =  async (req, res) => {
	try {
		const { products, couponCode } = req.body;

        // Makes sure products is an array and not empty.
		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

        //Create lineItems → Stripe’s format (name, image, unit price, quantity).
		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // Stripe requires price in cents, so if a product is $12.50, we send 1250
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

        // Check for coupon and apply discount if valid.
		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true }); // Check it belongs to this user and is still active.
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100); //If valid, reduce totalAmount by coupon’s discount %.
			}
		}

        // Stripe Checkout Session creation
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"], // Accept card payments
			line_items: lineItems, // Items being purchased
			mode: "payment", // One-time payment
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`, // Redirect to frontend with session ID on success
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`, // Redirect to frontend on cancel
            // if coupon exists, call helper (createStripeCoupon) to apply discount.
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage), 
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

        // If user spends $200 or more (20000 cents) → give them a new gift coupon (10% off).
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}
        //Send Stripe’s session id (frontend will use it to redirect user to payment).Send total amount (converted back from cents → dollars).
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });

	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

// Handle successful payment and create order
export const checkoutSuccess = async (req, res) => {
    
    try {
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status === "paid"){
            await Coupon.findOneAndUpdate(
                { code: session.metadata.couponCode, userId: session.metadata.userId},
                { isActive: false }
            );
            
            //create a new product
            const product = JSON.parse.parse(session.metadata.product);
            const newOrder = new Order({
                userId:session.metadata.userId,
                products: product.map(product => ({
                    productId: product._id,
                    quantity: product.quantity,
                    price: product.price
                })),
                totalAmount: session.amount_total / 100, // Convert cents to dollars
                stripeSessionId: session.id,
            });
            await newOrder.save();

            return res.json({ 
                success: true,
                message: "Payment successful and order created.",
                OrderId: newOrder._id
            });
        } 
    } catch (error) {
        console.error("Error processing checkout success:", error);
        res.status(500).json({ message: "Error processing checkout success", error: error.message });
    }
};

//helper function to create a Stripe coupon
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

//helper function to create a new coupon in our database
async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId }); // First, delete any old coupon for this user.

    // Then create new coupon:
	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}