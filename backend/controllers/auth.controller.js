import User from "../models/user.model.js";
import redis from "../lib/redis.js";
import jwt from "jsonwebtoken";

// Create JWT(JSON Web Token) tokens
const generateTokens = (userID) => {
  const accessToken = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });//used to authenticate user
  const refreshToken = jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });//used to obtain new access tokens
  return { accessToken, refreshToken };
};

// Uses Redis (a fast in-memory database) to store the refresh token. Key format: refresh_token:<userID>
const storeRefreshToken = async (userID, refreshToken) => {
  await redis.set(`refresh_token:${userID}`, refreshToken, { ex: 7 * 24 * 60 * 60 }); // Set expiration to 7 days
};

// Set cookies
const setCookies = (res, accessToken, refreshToken) => {
    // Set access token cookie
  res.cookie("access_token", accessToken, { 
    httpOnly: true, //prevent XSS attacks, cross-site scripting attacks
    secure: true, //ensure the cookie is sent over HTTPS
    sameSite: "Strict", //prevent CSRF attacks
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  // Set refresh token cookie
  res.cookie("refresh_token", refreshToken, { 
    httpOnly: true, 
    secure: true, 
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Signup user
export const signup =  async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ name, email, password }); // Create a new user instance

    
    // Save user to database
    await user.save();

    //authenticate user
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
			name: user.name,
			email: user.email,
		
      },
      message: "User created successfully"
    });
  } catch (error) {
     console.error(error);
    res.status(500).json({ message: "Error creating user", error: error.message || error.toString() });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; //Extract email & password from request body
    const user = await User.findOne({ email }); //Find user by email in MongoDB

    if(user && (await user.comparePassword(password))) { //Check if user exists & compare password, → calls the method created in user.model.js
      const { accessToken, refreshToken } = generateTokens(user._id); //Generate JWT tokens

      await storeRefreshToken(user._id, refreshToken); //Save refresh token in Redis
      setCookies(res, accessToken, refreshToken); //Send tokens as cookies to browser

      res.json({ //Send back user info & success message
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        message: "Login successful"
      });
    }
    else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error logging in:", error.message);
    res.status(500).json({ message: "Error logging in", error: error.message || error.toString() });
  }
};

// Logout user
export const logout =  async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
     const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
     // Remove refresh token from Redis
    await redis.del(`refresh_token:${decode.userID}`);
    }

    // Clear cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    console.log("Error logging out:", error.message);
    res.status(500).json({ message: "Error logging out", error: error.message || error.toString() });
  }
};

//this will refresh the access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; //Get refresh token from cookies
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); //Verify refresh token
    const storedToken = await redis.get(`refresh_token:${decode.userID}`); //Check stored token in Redis
    if (storedToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    //Create a new access token
    const accessToken = jwt.sign({ userID: decode.userID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    // Send new access token as cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({ message: "Token refreshed successfully" });

  } catch (error) {
    console.log("Error refreshing token:", error.message);
    res.status(500).json({ message: "Error refreshing token", error: error.message || error.toString() });
  }
};

export const getProfile = async (req, res) => {
try {
  res.json(req.user);

} catch (error) {
  res.status(500).json({message: "server error", error: error.message});
}
};