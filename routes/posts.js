const express = require('express');
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /posts - Create a post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { description, imageUrl, imageBase64 } = req.body;
    const userId = req.user._id;

    // Basic validation
    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    const post = new Post({
      userId,
      description,
      imageUrl: imageUrl || null,
      imageBase64: imageBase64 || null
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

// GET /posts?mine=true - Fetch user's posts
// GET /posts - Fetch all posts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { mine } = req.query;
    const userId = req.user._id;

    let posts;

    if (mine === 'true') {
      // Fetch user's own posts
      posts = await Post.find({ userId }).sort({ createdAt: -1 });
    } else {
      // Fetch all posts
      posts = await Post.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data: posts
    });
  } catch (error) {
    console.error('Fetch posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
});

module.exports = router;
