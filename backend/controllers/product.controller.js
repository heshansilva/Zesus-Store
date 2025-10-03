import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import redis from "../lib/redis.js";

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
        // FIX: Changed from redis.Products.get to redis.get
        let featuredProducts = await redis.get('featuredProducts');
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        //if not in redis then fetch from db
        //.lean() is gonna return a plain JavaScript object instead of a mongoose document
        //which is more efficient for read-only operations. (like fetching data to send in a response)
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts || featuredProducts.length === 0) {
            return res.status(404).json({ message: "No featured products found" });
        }

        // Cache the featured products in Redis
        await redis.set('featuredProducts', JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        console.error("Error in getFeaturedProducts controller:", error);
        res.status(500).json({ message: "Error fetching featured products" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: "products",
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Error in createProduct controller:", error);
        res.status(500).json({ message: "Error creating product" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // First find the product

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
          // this will get the id of the image
            const publicId = product.image.split('/').pop().split('.')[0]; 
            
            // Delete image from Cloudinary
            try {
              await cloudinary.uploader.destroy(`products/${publicId}`);
              console.log("Image deleted from Cloudinary");
            } catch (error) {
              console.error("Error deleting image from Cloudinary:", error);
            }
        }

        // Delete product from database
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error in deleteProduct controller:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([ // Using MongoDB Aggregation Pipeline to fetch random products
        {
          $sample: { size: 4 },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            price: 1,
            image: 1,
          },
        }
      ]);  // Fetch 3 random products from the database (for recommendations)

    res.json(products);
  } catch (error) {
    console.error("Error in GetRecommendedProducts controller:", error);
    res.status(500).json({ message: "Error fetching recommended products" });
  }
};

// FIX: Enhanced getProductByCategory with better error handling
export const getProductByCategory = async (req, res) => {
  const { category } = req.params; // Extract category from request parameters
  try {
    console.log("Fetching products for category:", category); // Debug log
    
    const products = await Product.find({ category }); // Fetch products by category from the database
    
    console.log("Found products:", products.length); // Debug log
    
    if (!products || products.length === 0) {
      return res.status(404).json({ 
        message: `No products found for category: ${category}`,
        products: []
      });
    }
    
    res.json({ products }); // Return products in same format as getAllProducts
  } catch (error) {
    console.error("Error in getProductByCategory controller:", error);
    res.status(500).json({ message: "Error fetching products by category" });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  // Toggle the isFeatured status of a product by ID
  try {
    const product = await Product.findById(req.params.id);
    if(product)  {
      product.isFeatured = !product.isFeatured; // Toggle the isFeatured status
      const updatedProduct = await product.save(); // Save the updated product
      // Update the featured products cache in Redis
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error in toggleFeaturedProduct controller:", error);
    res.status(500).json({ message: "Error toggling featured product" });
  }
};

// Function to update the featured products cache in Redis
const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean(); // Fetch featured products from the database
    // FIX: Changed from redis.Products.set to redis.set
    await redis.set('featuredProducts', JSON.stringify(featuredProducts)); // Update the cache in Redis
    
  } catch (error) {
    console.error("Error updating featured products cache:", error);
  }
};