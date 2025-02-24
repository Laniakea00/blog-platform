const express = require('express');
const { createPost, getAllPosts, getPostById, updatePost, deletePost, getUserPosts } = require('../controllers/postController');
const { authenticateUser, authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /posts
 * @desc    Create a new post
 * @access  Private (Requires Authentication)
 */
router.post('/', authenticateUser, createPost);

/**
 * @route   GET /posts
 * @desc    Get all posts
 * @access  Public
 */
router.get('/', getAllPosts);

/**
 * @route   GET /posts/mine
 * @desc    Get only the logged-in user's posts
 * @access  Private (Requires Authentication)
 */
router.get('/mine', authenticateUser, getUserPosts);

/**
 * @route   GET /posts/:id
 * @desc    Get a single post by ID
 * @access  Public
 */
router.get('/:id', getPostById);

/**
 * @route   PUT /posts/:id
 * @desc    Update a post
 * @access  Private (Only the post owner can update)
 */
router.put('/:id', authenticateUser, updatePost);

/**
 * @route   DELETE /posts/:id
 * @desc    Delete a post (only admin or owner can delete)
 * @access  Private (Admin or Post Owner)
 */
router.delete('/:id', authenticateUser, deletePost);

/**
 * @route   DELETE /posts/admin/:id
 * @desc    Admin can delete any post
 * @access  Private (Admin only)
 */
router.delete('/admin/:id', authenticateAdmin, deletePost);

module.exports = router;
