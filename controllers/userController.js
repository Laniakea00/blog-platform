const { ObjectId } = require('mongodb');
const { client } = require('../config/db'); // Подключение к базе данных

exports.getAllUsers = async (req, res) => {
    try {
        const db = client.db('blog-platform');
        const users = await db.collection('users').find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        const updatedUser = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { username, email } },
            { returnDocument: 'after' }
        );

        if (!updatedUser.value) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser.value);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.changeUserRole = async (req, res) => {
    try {
        const db = client.db('blog-platform'); // Получаем базу данных
        const { id } = req.params;
        const { role } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: { role } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User not found or role not changed' });
        }

        res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const db = client.db('blog-platform'); // Получаем базу данных
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
