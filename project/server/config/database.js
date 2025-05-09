import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database with tables
export const initDatabase = async () => {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.end();
    
    // Connect to the database and create tables
    const db = await pool.getConnection();
    
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        is_premium BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Books table
    await db.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        cover_image VARCHAR(255),
        description TEXT,
        rating DECIMAL(3,1) DEFAULT 0,
        review_count INT DEFAULT 0,
        price DECIMAL(10,2) NULL,
        is_premium BOOLEAN DEFAULT FALSE,
        is_free BOOLEAN DEFAULT FALSE,
        has_audio BOOLEAN DEFAULT FALSE,
        published_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Genres table
    await db.query(`
      CREATE TABLE IF NOT EXISTS genres (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      )
    `);
    
    // Book_genres junction table
    await db.query(`
      CREATE TABLE IF NOT EXISTS book_genres (
        book_id INT,
        genre_id INT,
        PRIMARY KEY (book_id, genre_id),
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
      )
    `);
    
    // User_books table for tracking reading progress, library, etc.
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_books (
        user_id INT,
        book_id INT,
        progress DECIMAL(5,2) DEFAULT 0,
        is_favorite BOOLEAN DEFAULT FALSE,
        is_in_library BOOLEAN DEFAULT FALSE,
        last_read TIMESTAMP NULL,
        PRIMARY KEY (user_id, book_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `);
    
    // Reviews table
    await db.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        book_id INT,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `);
    
    // Insert default genres if they don't exist
    const genres = [
      'Adventure', 'Science Fiction', 'Mystery', 'Romance', 'Fantasy', 
      'Thriller', 'Historical Fiction', 'Non-fiction', 'Biography', 'Self-help'
    ];
    
    for (const genre of genres) {
      await db.query('INSERT IGNORE INTO genres (name) VALUES (?)', [genre]);
    }
    
    // Insert admin user if it doesn't exist
    const [adminExists] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@textcenter.com']);
    
    if (adminExists.length === 0) {
      // Password: admin123 (hashed)
      const hashedPassword = '$2a$10$XFE/UQEjIjRN3Q9KhfnQB.QQtGfCvRIQYVdZaJ5nG/KFI4KOVhOeO';
      await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@textcenter.com', hashedPassword, 'admin']
      );
    }
    
    db.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Export pool for use in other files
export default pool;