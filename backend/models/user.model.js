import mongoose from "mongoose";
import bcrypt from "bcryptjs"; 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true, //use trim to remove whitespace
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
cartItems:[
    {
        quantity: {
            type: Number,
            default: 1,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        
        },
    }
],
role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
},
}, { timestamps: true }//create timestamps for createdAt and updatedAt fields
);

 

//pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
}); 

//method to compare password during login
userSchema.methods.comparePassword = async function (Password) {
  return bcrypt.compare(Password, this.password);
};

const User = mongoose.model("User", userSchema);//create User model

export default User; //to use in other parts of the application
