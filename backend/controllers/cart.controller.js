export const addToCart = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;

        const existingItem = user.cartItem.find(item => item.id === productId);
        if(existingItem){
            existingItem.quantity += 1;
        } else{
            user.cartItem.push(productId)
        }

        await user.save();
        req.json(user.cartItem)

    } catch (error) {
        console.error("Error in addToCart controller:", error);
        res.status(500).json({ message: "Error adding to cart" });
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
       const {productId} = req.body;
         const user = req.user;
         if(!productId){
            user.cartItem = [];
         } else {
            user.cartItem = user.cartItem.filter(item => item.id !== productId);
         }
         await user.save();
         res.json({ message: "Items removed from cart" });
    } catch (error) {
        console.error("Error in removeAllFromCart controller:", error);
        res.status(500).json({ message: "Error removing items from cart" });
    }
};