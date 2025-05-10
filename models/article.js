const mongoose = require('mongoose');
const pool = require('../config/mysql');

const articleSchema = new mongoose.Schema({
  metadata_id: Number,
  content: String
});

const ArticleMongo = mongoose.model('Article', articleSchema);

class Article {
  static async create(userId, title, content) {
    try {
      console.log('Creating article:', { userId, title, content });
      const [result] = await pool.query(
        'INSERT INTO article_metadata (user_id, title) VALUES (?, ?)',
        [userId, title]
      );
      console.log('MySQL metadata saved, ID:', result.insertId);
      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB not connected');
      }
      const article = new ArticleMongo({ metadata_id: result.insertId, content });
      const savedArticle = await article.save();
      console.log('MongoDB article saved:', savedArticle);
      return { id: result.insertId, userId, title, content };
    } catch (error) {
      console.error('Error saving article:', error.message, error.stack);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [metadata] = await pool.query(
        'SELECT m.*, u.username FROM article_metadata m JOIN users u ON m.user_id = u.id'
      );
      console.log('MySQL metadata retrieved:', metadata);
      const articles = await Promise.all(metadata.map(async (meta) => {
        const content = await ArticleMongo.findOne({ metadata_id: meta.id });
        console.log('MongoDB content for metadata_id', meta.id, ':', content);
        return { id: meta.id, title: meta.title, username: meta.username, content: content?.content };
      }));
      return articles;
    } catch (error) {
      console.error('Error fetching articles:', error.message, error.stack);
      throw error;
    }
  }
}

module.exports = Article;