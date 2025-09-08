import Product from "../models/product.model.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // Fetch all products from the database
    res.json({ products }); // Send the products as a JSON response
  } catch (error) {
    console.error("Error in getAllProducts controller:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await Redis.Products.get('featuredProducts');
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        //if not in redis then fetch from db
        //.lean() is gonna return a plain JavaScript object instead of a mongoose document
        //which is more efficient for read-only operations. (like fetching data to send in a response)
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        // Cache the featured products in Redis
        await redis.Products.set('featuredProducts', JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        console.error("Error in getFeaturedProducts controller:", error);
        res.status(500).json({ message: "Error fetching featured products" });
    }
}