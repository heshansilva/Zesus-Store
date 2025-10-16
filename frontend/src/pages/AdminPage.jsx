
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import useProductStore from "../stores/useProductStore";
import { useState, useEffect } from "react";


const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();
	useEffect(() => { fetchAllProducts(); }, [fetchAllProducts]);

	return (
		<div className='min-h-screen relative overflow-hidden bg-gray-900'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
				className='text-4xl font-bold mb-8 text-white text-center'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				>
				Admin Dashboard
				</motion.h1>

				{/* Tabs with modern, minimal style */}
				<div className='flex justify-center mb-8 space-x-4'>
				{tabs.map((tab) => (
					<button
					key={tab.id}
					onClick={() => setActiveTab(tab.id)}
					className={`
						flex items-center gap-2 px-5 py-2 rounded-lg font-medium
						transition-all duration-300 ease-in-out
						${
						activeTab === tab.id
							? "bg-white text-black shadow-lg scale-105" // Active tab: subtle scale + shadow
							: "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105"
						}
					`}
					>
					<tab.icon className='h-5 w-5' />
					{tab.label}
					</button>
				))}
				</div>

				{/* Tab content */}
				<div className='space-y-6'>
				{activeTab === "create" && <CreateProductForm />}
				{activeTab === "products" && <ProductsList />}
				{activeTab === "analytics" && <AnalyticsTab />}
				</div>
			</div>
			</div>

	);
};
export default AdminPage;
