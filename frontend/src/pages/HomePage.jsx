import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shorts", name: "Shorts", imageUrl: "/shorts.jpg" },
  { href: "/hoodies", name: "Hoodies", imageUrl: "/hoodies.jpg" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/shirts", name: "Shirts", imageUrl: "/shirts.jpg" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen bg-black text-lightgray overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Heading */}
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-white mb-4 tracking-wide">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in timeless monochrome fashion
        </p>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {/* Featured Products Section */}
        {!isLoading && products.length > 0 && (
          <div className="mt-20">
            <FeaturedProducts featuredProducts={products} />
          </div>
        )}
      </div>

      {/* Optional subtle gradient fade for modern effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70 pointer-events-none" />
    </div>
  );
};

export default HomePage;
