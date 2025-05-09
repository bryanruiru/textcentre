import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, is_premium, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Get user's reading stats
    const [stats] = await pool.query(`
      SELECT 
        COUNT(DISTINCT ub.book_id) as total_books,
        SUM(CASE WHEN ub.progress = 1 THEN 1 ELSE 0 END) as completed_books
      FROM user_books ub
      WHERE ub.user_id = ?
    `, [req.user.id]);
    
    // Get recently read books
    const [recentBooks] = await pool.query(`
      SELECT b.id, b.title, b.author, b.cover_image, ub.progress, ub.last_read
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      WHERE ub.user_id = ? AND ub.last_read IS NOT NULL
      ORDER BY ub.last_read DESC
      LIMIT 5
    `, [req.user.id]);
    
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.is_premium === 1,
        createdAt: user.created_at
      },
      stats: {
        totalBooks: stats[0].total_books,
        completedBooks: stats[0].completed_books
      },
      recentBooks: recentBooks.map(book => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        coverImage: book.cover_image,
        progress: parseFloat(book.progress),
        lastRead: book.last_read
      }))
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    
    // Get current user data
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }
    
    // Update user data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // If password is being changed
    if (currentPassword && newPassword) {
      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!validPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateData.password = hashedPassword;
    }
    
    // Update user in database
    if (Object.keys(updateData).length > 0) {
      const updateFields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const updateValues = Object.values(updateData);
      
      await pool.query(
        `UPDATE users SET ${updateFields} WHERE id = ?`,
        [...updateValues, req.user.id]
      );
    }
    
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upgrade to premium
router.post('/upgrade-premium', verifyToken, async (req, res) => {
  try {
    // In a real app, this would include payment processing
    // For demo purposes, we'll just update the user's premium status
    
    await pool.query(
      'UPDATE users SET is_premium = TRUE WHERE id = ?',
      [req.user.id]
    );
    
    res.status(200).json({ message: 'Upgraded to premium successfully' });
  } catch (error) {
    console.error('Upgrade premium error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;