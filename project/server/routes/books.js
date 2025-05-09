import express from 'express';
import pool from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get all books with optional filters
router.get('/', async (req, res) => {
  try {
    const { genre, search, limit = 20, page = 1, sort = 'title', order = 'asc' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT b.*, GROUP_CONCAT(g.name) as genres
      FROM books b
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
    `;
    
    const queryParams = [];
    
    // Add WHERE clauses for filters
    const whereConditions = [];
    
    if (genre) {
      whereConditions.push('g.name = ?');
      queryParams.push(genre);
    }
    
    if (search) {
      whereConditions.push('(b.title LIKE ? OR b.author LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }
    
    // Add GROUP BY, ORDER BY, and LIMIT
    query += ' GROUP BY b.id';
    query += ` ORDER BY b.${sort} ${order === 'desc' ? 'DESC' : 'ASC'}`;
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Execute query
    const [books] = await pool.query(query, queryParams);
    
    // Count total books for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT b.id) as total
      FROM books b
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
    `;
    
    if (whereConditions.length > 0) {
      countQuery += ' WHERE ' + whereConditions.join(' AND ');
    }
    
    const [countResult] = await pool.query(countQuery, queryParams.slice(0, -2));
    const totalBooks = countResult[0].total;
    
    // Format books data
    const formattedBooks = books.map(book => ({
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      coverImage: book.cover_image,
      description: book.description,
      rating: parseFloat(book.rating),
      reviewCount: book.review_count,
      price: book.price ? parseFloat(book.price) : null,
      isPremium: book.is_premium === 1,
      isFree: book.is_free === 1,
      hasAudio: book.has_audio === 1,
      genre: book.genres ? book.genres.split(',') : [],
      publishedDate: book.published_date ? new Date(book.published_date).toISOString().split('T')[0] : null
    }));
    
    res.status(200).json({
      books: formattedBooks,
      pagination: {
        total: totalBooks,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalBooks / limit)
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get book details
    const [books] = await pool.query(`
      SELECT b.*, GROUP_CONCAT(g.name) as genres
      FROM books b
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
      WHERE b.id = ?
      GROUP BY b.id
    `, [id]);
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const book = books[0];
    
    // Get reviews
    const [reviews] = await pool.query(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.book_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [id]);
    
    // Format book data
    const formattedBook = {
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      coverImage: book.cover_image,
      description: book.description,
      rating: parseFloat(book.rating),
      reviewCount: book.review_count,
      price: book.price ? parseFloat(book.price) : null,
      isPremium: book.is_premium === 1,
      isFree: book.is_free === 1,
      hasAudio: book.has_audio === 1,
      genre: book.genres ? book.genres.split(',') : [],
      publishedDate: book.published_date ? new Date(book.published_date).toISOString().split('T')[0] : null,
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        userName: review.user_name,
        createdAt: review.created_at
      }))
    };
    
    res.status(200).json({ book: formattedBook });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add book to user's library
router.post('/library/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if book exists
    const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if book is already in library
    const [existingEntries] = await pool.query(
      'SELECT * FROM user_books WHERE user_id = ? AND book_id = ?',
      [userId, id]
    );
    
    if (existingEntries.length > 0) {
      // Update existing entry
      await pool.query(
        'UPDATE user_books SET is_in_library = TRUE WHERE user_id = ? AND book_id = ?',
        [userId, id]
      );
    } else {
      // Create new entry
      await pool.query(
        'INSERT INTO user_books (user_id, book_id, is_in_library) VALUES (?, ?, TRUE)',
        [userId, id]
      );
    }
    
    res.status(200).json({ message: 'Book added to library' });
  } catch (error) {
    console.error('Add to library error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's library
router.get('/user/library', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [books] = await pool.query(`
      SELECT b.*, ub.progress, ub.last_read, GROUP_CONCAT(g.name) as genres
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
      WHERE ub.user_id = ? AND ub.is_in_library = TRUE
      GROUP BY b.id
      ORDER BY ub.last_read DESC
    `, [userId]);
    
    // Format books data
    const formattedBooks = books.map(book => ({
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      coverImage: book.cover_image,
      description: book.description,
      rating: parseFloat(book.rating),
      reviewCount: book.review_count,
      price: book.price ? parseFloat(book.price) : null,
      isPremium: book.is_premium === 1,
      isFree: book.is_free === 1,
      hasAudio: book.has_audio === 1,
      genre: book.genres ? book.genres.split(',') : [],
      publishedDate: book.published_date ? new Date(book.published_date).toISOString().split('T')[0] : null,
      progress: book.progress ? parseFloat(book.progress) : 0,
      lastRead: book.last_read
    }));
    
    res.status(200).json({ books: formattedBooks });
  } catch (error) {
    console.error('Get library error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reading progress
router.put('/progress/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;
    
    if (progress < 0 || progress > 1) {
      return res.status(400).json({ message: 'Progress must be between 0 and 1' });
    }
    
    // Check if book exists
    const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if entry exists
    const [existingEntries] = await pool.query(
      'SELECT * FROM user_books WHERE user_id = ? AND book_id = ?',
      [userId, id]
    );
    
    if (existingEntries.length > 0) {
      // Update existing entry
      await pool.query(
        'UPDATE user_books SET progress = ?, last_read = NOW() WHERE user_id = ? AND book_id = ?',
        [progress, userId, id]
      );
    } else {
      // Create new entry
      await pool.query(
        'INSERT INTO user_books (user_id, book_id, progress, last_read) VALUES (?, ?, ?, NOW())',
        [userId, id, progress]
      );
    }
    
    res.status(200).json({ message: 'Progress updated' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post('/review/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if book exists
    const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user already reviewed this book
    const [existingReviews] = await pool.query(
      'SELECT * FROM reviews WHERE user_id = ? AND book_id = ?',
      [userId, id]
    );
    
    if (existingReviews.length > 0) {
      // Update existing review
      await pool.query(
        'UPDATE reviews SET rating = ?, comment = ? WHERE user_id = ? AND book_id = ?',
        [rating, comment, userId, id]
      );
    } else {
      // Create new review
      await pool.query(
        'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)',
        [userId, id, rating, comment]
      );
      
      // Update review count
      await pool.query(
        'UPDATE books SET review_count = review_count + 1 WHERE id = ?',
        [id]
      );
    }
    
    // Update book rating
    const [ratingResult] = await pool.query(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE book_id = ?',
      [id]
    );
    
    await pool.query(
      'UPDATE books SET rating = ? WHERE id = ?',
      [ratingResult[0].avg_rating, id]
    );
    
    res.status(200).json({ message: 'Review added' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;