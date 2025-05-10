const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');

router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body.username, req.body.email);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/articles', async (req, res) => {
  try {
    console.log('Received article data:', req.body);
    const article = await Article.create(req.body.userId, req.body.title, req.body.content);
    console.log('Article created:', article);
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;