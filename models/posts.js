const { client } = require('../config/db');

// Получаем базу данных перед работой с коллекцией
const db = client.db('blog-platform');
const postsCollection = db.collection('posts'); // Название коллекции

// Создание поста
const createPost = async (postData) => {
    const { title, content, author } = postData;

    const newPost = {
        title,
        content,
        author, // Здесь должен быть `ObjectId`, если используешь `User`
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await postsCollection.insertOne(newPost);
    return result.insertedId;
};

// Получение всех постов
const getAllPosts = async () => {
    return await postsCollection.find().toArray();
};

// Получение поста по ID
const getPostById = async (postId) => {
    const { ObjectId } = require('mongodb');
    return await postsCollection.findOne({ _id: new ObjectId(postId) });
};

// Обновление поста
const updatePost = async (postId, updatedData) => {
    const { ObjectId } = require('mongodb');
    return await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $set: { ...updatedData, updatedAt: new Date() } }
    );
};

// Удаление поста
const deletePost = async (postId) => {
    const { ObjectId } = require('mongodb');
    return await postsCollection.deleteOne({ _id: new ObjectId(postId) });
};

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost };
