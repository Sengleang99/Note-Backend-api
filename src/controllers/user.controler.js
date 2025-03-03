const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Read users
const readUser = async (req, res) => {
  try {
    const user = await userModel.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error!", status: false });
  }
};

// read user by token only one user
const getUserByToken = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming the token is sent in the body
    // Find the user by token (or modify this according to how you store the token)
    const isUser = await userModel.findOne({ userId }); // Modify this according to your database structure

    if (!isUser) {
      return res.status(404);
    }

    res.status(200).json({
      user: {
        name: isUser.name,
        email: isUser.email,
        _id: isUser._id,
        createAt: isUser.createAt,
      },
      message: ""
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create account
const createAccount = async (req, res) => {
  try {
    // Get data from request body
    const { name, email, password } = req.body;

    // Validate input
    if (!name)
      return res
        .status(400)
        .json({ message: "Name is required!", status: false });
    if (!email)
      return res
        .status(400)
        .json({ message: "Email is required!", status: false });
    if (!password)
      return res
        .status(400)
        .json({ message: "Password is required!", status: false });

    // Check if user already exists
    const existedUser = await userModel.findOne({ email: email });
    if (existedUser) {
      return res
        .status(400)
        .json({ message: "Email already exists!", status: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    // Generate access token (use user ID and email instead of full user object)
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "User created successfully!",
      status: true,
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
    });
  } catch (error) {
    console.error("Error creating user:", error); // Log error for debugging
    res.status(500).json({ message: "Server error!", status: false });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email)
      return res
        .status(400)
        .json({ message: "Email is required!", status: false });
    if (!password)
      return res
        .status(400)
        .json({ message: "Password is required!", status: false });

    // Find user in the database
    const userInfo = await userModel.findOne({ email });

    if (!userInfo)
      return res
        .status(400)
        .json({ message: "User not found!!", status: false });

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, userInfo.password);
    if (!passwordMatch)
      return res
        .status(400)
        .json({ message: "Incorrect password!", status: false });

    // Generate access token (use user ID and email instead of full user object)
    const user = {
      id: userInfo._id,
      email: userInfo.email,
      name: userInfo.name,
    };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Send response
    res
      .status(200)
      .json({ message: "Login success!", status: true, accessToken, email });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error!", status: false });
  }
};

module.exports = { readUser, createAccount, login, getUserByToken };
