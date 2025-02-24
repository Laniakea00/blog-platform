const { ObjectId } = require("mongodb");
const db = require('../config/db');

// Получить всех пользователей
exports.getAllUsers = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('blogPlatform');
        const users = await db.collection("users").find().toArray();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
};


// Изменить роль пользователя
exports.changeUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            { $set: { role } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User role updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user role", error });
    }
};

// Удалить пользователя
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

// Получить все посты
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await db.collection("posts").find().toArray();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
};

// Удалить пост
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error });
    }
};
