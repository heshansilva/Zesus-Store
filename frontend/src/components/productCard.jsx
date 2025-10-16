import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			// add to cart
			addToCart(product);
		}
	};

	return (
				<div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg bg-black transition-all duration-300">
			<div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
				<img
				className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
				src={product.image}
				alt="product image"
				/>
			</div>

			<div className="mt-4 px-5 pb-5">
				<h5 className="text-xl font-semibold tracking-tight text-white">{product.name}</h5>

				<div className="mt-2 mb-5 flex items-center justify-between">
				<p>
					<span className="text-3xl font-bold text-white">${product.price}</span>
				</p>
				</div>

				<button
				className="flex w-full items-center justify-center rounded-lg bg-black border border-white px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-300"
				onClick={handleAddToCart}
				>
				<ShoppingCart size={22} className="mr-2" />
				Add to cart
				</button>
			</div>
			</div>

	);
};
export default ProductCard;