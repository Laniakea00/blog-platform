const { ObjectId } = require('mongodb');
const { client } = require('../config/db');
const db = client.db('blog-platform');
const usersCollection = db.collection('users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashedPassword,
            role: role || "user",
        };

        await db.collection("users").insertOne(newUser);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};

// Логин пользователя
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        // Check if user.id is a valid ObjectId
        if (!ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Get user by ID, excluding password
        const user = await usersCollection.findOne(
            { _id: new ObjectId(req.user.id) },
            { projection: { password: 0 } } // Exclude password field
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
