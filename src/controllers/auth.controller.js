
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
    try {
        const {
            username,
            email,
            password,
            role = "user"
        } = req.body;

        // Check if user already exists
        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, 10);

        // Create new user
        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        );

        // Set cookie
        res.cookie("token", token);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = { registerUser };
