
export const getCartProducts = async (req, res) => {
    try {
        //Find all products whose _id matches items in user.cartItem
        const products = await Product.find({_id:{$in: req.user.cartItem}});

        //Attach quantity for each product by matching it with cartItem
        const cartItem = products.map(product => {
            const itemInCart = req.user.cartItem.find(item => item.id === product._id.toString());
            return {
                ...product.toObject(),    // Convert Mongoose document to plain object
                quantity: itemInCart ? itemInCart.quantity : 0
            };
        });

        // /Send response to frontend
        res.json(cartItem);
    } catch (error) {
        console.error("Error in getCartProducts controller:", error);
        res.status(500).json({ message: "Error fetching cart items" });
    }
};

// Add item to cart for the authenticated user
export const addToCart = async (req, res) => {
    try {
        const {productId} = req.body; // product ID from frontend
        const user = req.user; // current logged-in user (set by middleware)

         // Check if the product already exists in the cart
        const existingItem = user.cartItem.find(item => item.id === productId);
        if(existingItem){
            existingItem.quantity += 1;  // If product already in cart → increase quantity
        } else{
            user.cartItem.push(productId)  // Otherwise add it as a new item
        }

        await user.save(); // Save updated cart to database
        res.json(user.cartItem) // Return updated cart → back to frontend.

    } catch (error) {
        console.error("Error in addToCart controller:", error);
        res.status(500).json({ message: "Error adding to cart" });
    }
}

//remove all items from cart or a specific item if productId is provided
export const removeAllFromCart = async (req, res) => {
    try {
       const {productId} = req.body;
         const user = req.user;

          // If no productId is provided → remove ALL items from cart
         if(!productId){
            user.cartItem = [];
         } else {
            user.cartItem = user.cartItem.filter(item => item.id !== productId);  // If productId provided → remove only that product
         }
         await user.save();
         res.json({ message: "Items removed from cart" });
    } catch (error) {
        console.error("Error in removeAllFromCart controller:", error);
        res.status(500).json({ message: "Error removing items from cart" });
    }
};

// update item quantity in cart
export const updateQuantity = async (req, res) => {
    try {
        const {id:productId} = req.body; // product ID (renamed from id → productId)
        const {quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItem.find(item => item.id === productId); // Check if the product already exists in the cart
        if(existingItem){
            // If quantity is 0 → remove that item from cart
            if(quantity === 0){
                user.cartItem = user.cartItem.filter(item => item.id !== productId);  // If productId provided → remove only that product
                await user.save();
                return res.json(user.cartItem);
            }

            existingItem.quantity = quantity;  // If product already in cart → increase quantity
            await user.save(); // Save updated cart to database
            res.json(user.cartItem) // Return updated cart → back to frontend.
        }
    } catch (error) {
        console.error("Error in updatedQuantity controller:", error);
        res.status(500).json({ message: "Error updating item quantity" });
    }
};


//controller used to handle cart-related operations such as adding, removing, and updating items in the cart for authenticated users