import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

const stripePromise = loadStripe("pk_test_51S5X39LrjXd1xKvEfd5EIu8AEsoxfw9D7gs9Z5fNzJl4uTdcmEuIQJAkrrcZnUWVIDt3ISsw7dKb3QKet1I0YVow00rbrOHnnu");
const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		const stripe = await stripePromise;
		const res = await axios.post("/payments/create-checkout-session", {
			products: cart,
			couponCode: coupon ? coupon.code : null,
		});

		const session = res.data;
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			console.error("Error:", result.error);
		}
	};

	return (
		<motion.div
  className='space-y-4 rounded-lg border border-gray-700 bg-black p-4 shadow-sm sm:p-6'
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <p className='text-xl font-semibold text-white'>Order summary</p>

  <div className='space-y-4'>
    <div className='space-y-2'>
      {/* Original Price */}
      <dl className='flex items-center justify-between gap-4'>
        <dt className='text-base font-normal text-gray-300'>Original price</dt>
        <dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
      </dl>

      {/* Savings */}
      {savings > 0 && (
        <dl className='flex items-center justify-between gap-4'>
          <dt className='text-base font-normal text-gray-300'>Savings</dt>
          <dd className='text-base font-medium text-gray-400'>-${formattedSavings}</dd>
        </dl>
      )}

      {/* Coupon */}
      {coupon && isCouponApplied && (
        <dl className='flex items-center justify-between gap-4'>
          <dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
          <dd className='text-base font-medium text-gray-400'>-{coupon.discountPercentage}%</dd>
        </dl>
      )}

      {/* Total */}
      <dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
        <dt className='text-base font-bold text-white'>Total</dt>
        <dd className='text-base font-bold text-gray-400'>Rs{formattedTotal}</dd>
      </dl>
    </div>

    {/* Checkout Button */}
    <motion.button
  className='flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black
             hover:bg-black hover:text-white border border-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400
             transition duration-150 ease-in-out'
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handlePayment}
>
  Proceed to Checkout
</motion.button>

    {/* Continue Shopping Link */}
    <div className='flex items-center justify-center gap-2'>
      <span className='text-sm font-normal text-gray-400'>or</span>
      <Link
        to='/'
        className='inline-flex items-center gap-2 text-sm font-medium text-gray-400 underline hover:text-white hover:no-underline transition'
      >
        Continue Shopping
        <MoveRight size={16} />
      </Link>
    </div>
  </div>
</motion.div>

	);
};
export default OrderSummary;