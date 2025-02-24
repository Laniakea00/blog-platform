const bcrypt = require('bcryptjs');
const { client } = require('../config/db');

// Получаем базу данных перед работой с коллекцией
const db = client.db('blog-platform');
const usersCollection = db.collection('users');

// Создание пользователя (регистрация)
const createUser = async (userData) => {
    const { username, email, password, role = 'user' } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword, role, createdAt: new Date() };

    const result = await usersCollection.insertOne(newUser);
    return result.insertedId;
};

// Поиск пользователя по email
const findUserByEmail = async (email) => {
    return await usersCollection.findOne({ email });
};

// Проверка пароля
const comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = { createUser, findUserByEmail, comparePassword };
