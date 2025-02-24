const { ObjectId } = require('mongodb');
const { client } = require('../config/db');

// Получаем коллекцию постов из БД
const getPostsCollection = () => {
    const db = client.db('blog-platform');
    return db.collection('posts');
};

const getUsersCollection = () => {
    const db = client.db('blog-platform');
    return db.collection('users');
};

/**
 * @desc Create a new post
 * @route POST /posts
 * @access Private
 */
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const postsCollection = getPostsCollection();
        const newPost = {
            title,
            content,
            author: req.user.id, // предполагается, что middleware authMiddleware устанавливает req.user
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await postsCollection.insertOne(newPost);
        res.status(201).json({ ...newPost, _id: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc Get all posts
 * @route GET /posts
 * @access Public
 */
exports.getAllPosts = async (req, res) => {
    try {
        const postsCollection = getPostsCollection();
        const usersCollection = getUsersCollection();

        const posts = await postsCollection.find().toArray();

        for (let post of posts) {
            const user = await usersCollection.findOne({ _id: new ObjectId(post.author) });
            post.authorUsername = user ? user.username : 'Unknown';
        }

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


/**
 * @desc Get a single post by ID
 * @route GET /posts/:id
 * @access Public
 */
exports.getPostById = async (req, res) => {
    try {
        const postsCollection = getPostsCollection();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc Get only the logged-in user's posts
 * @route GET /posts/mine
 * @access Private
 */
exports.getUserPosts = async (req, res) => {
    try {
        const postsCollection = getPostsCollection();
        const usersCollection = getUsersCollection();
        const userPosts = await postsCollection.find({ author: req.user.id }).toArray();

        for (let post of userPosts) {
            const user = await usersCollection.findOne({ _id: new ObjectId(post.author) });
            post.authorUsername = user ? user.username : 'Unknown';
        }

        res.json(userPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc Update a post
 * @route PUT /posts/:id
 * @access Private
 */
exports.updatePost = async (req, res) => {
    try {
        const postsCollection = getPostsCollection();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Проверяем, является ли текущий пользователь автором поста
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { title, content } = req.body;
        const updatedData = {};
        if (title) updatedData.title = title;
        if (content) updatedData.content = content;
        updatedData.updatedAt = new Date();

        await postsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );
        const updatedPost = await postsCollection.findOne({ _id: new ObjectId(id) });
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


/**
 * @desc Delete a post
 * @route DELETE /posts/:id
 * @access Private
 */
exports.deletePost = async (req, res) => {
    try {
        const postsCollection = getPostsCollection();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Проверяем, является ли текущий пользователь автором поста
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await postsCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
