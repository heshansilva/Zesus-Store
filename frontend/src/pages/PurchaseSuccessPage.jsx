import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				await axios.post("/payments/checkout-success", {
					sessionId,
				});
				clearCart();
			} catch (error) {
				console.log(error);
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError("No session ID found in the URL");
		}
	}, [clearCart]);

	if (isProcessing) return "Processing...";

	if (error) return `Error: ${error}`;

	return (
			<motion.div
				className='h-screen flex items-center justify-center px-4 relative'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
			>
				<div className='fixed inset-0 pointer-events-none z-0'>
					<Confetti
						width={window.innerWidth}
						height={window.innerHeight}
						gravity={0.1}
						numberOfPieces={700}
						recycle={false}
					/>
				</div>

				<motion.div
					className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'
					initial={{ scale: 0.8, y: 20, opacity: 0 }}
					animate={{ scale: 1, y: 0, opacity: 1 }}
					transition={{ duration: 0.6 }}
				>
					<div className='p-6 sm:p-8'>
						<div className='flex justify-center'>
							<CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
							Purchase Successful!
						</h1>
						<p className='text-gray-300 text-center mb-2'>
							Thank you for your order. {"We're"} processing it now.
						</p>
						<p className='text-emerald-400 text-center text-sm mb-6'>
							Check your email for order details and updates.
						</p>

						<div className='bg-gray-700 rounded-lg p-4 mb-6 shadow-inner border border-gray-600'>
							<div className='flex items-center justify-between mb-2'>
								<span className='text-sm text-gray-400'>Order number</span>
								<span className='text-sm font-semibold text-emerald-400'>#12345</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-gray-400'>Estimated delivery</span>
								<span className='text-sm font-semibold text-emerald-400'>3-5 business days</span>
							</div>
						</div>

						<div className='space-y-4'>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className='w-full bg-white text-black border border-white hover:bg-black hover:text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'
							>
								<HandHeart className='mr-2' size={18} />
								Thanks for trusting us!
							</motion.button>

							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<Link
									to="/"
									className='w-full bg-gray-700 hove hover:bg-white hover:text-black hover:border-white font-bold  py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'
								>
									Continue Shopping
									<ArrowRight className='ml-2' size={18} />
								</Link>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</motion.div>
	);
};

export default PurchaseSuccessPage;