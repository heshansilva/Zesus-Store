import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/productCard";
import { Link } from "react-router-dom";

const CategoryPage = () => {
	const { category } = useParams();
	const { fetchProductsByCategory, products, loading } = useProductStore();

	useEffect(() => {
		console.log("CategoryPage - Current category:", category); // Debug log
		if (category) {
			fetchProductsByCategory(category);
		}
	}, [fetchProductsByCategory, category]);

	console.log("CategoryPage products:", products); // Debug log

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400"></div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-black text-white'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				
				<motion.h1
				className='text-center text-4xl sm:text-5xl font-bold text-white mb-8'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				>
				{category?.charAt(0)?.toUpperCase() + category?.slice(1)}
				</motion.h1>

				{products && products.length > 0 ? (
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{products.map((product) => (
					<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
				) : (
				<motion.div
					className='text-center py-16'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
				>
					<h3 className='text-2xl font-semibold text-white mb-4'>No products found</h3>
					<p className='text-gray-400'>
					No products available in the "{category}" category at the moment.
					</p>

					<Link
					to='/'
					className='mt-6 inline-block rounded-md border border-gray-600 bg-black px-6 py-2 text-white 
								hover:bg-white hover:text-black transition-all focus:outline-none focus:ring-2 focus:ring-gray-500'
					>
					Back to Shop
					</Link>
				</motion.div>
				)}
			</div>
		</div>

	);
};

export default CategoryPage;