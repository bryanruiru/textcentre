SELECT * FROM books WHERE id = ?', [id]);
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Delete book
    await pool.query('DELETE FROM books WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all genres (admin only)
router.get('/genres', verifyToken, isAdmin, async (req, res) => {
  try {
    const [genres] = await pool.query('SELECT * FROM genres ORDER BY name');
    
    res.status(200).json({
      genres: genres.map(genre => ({
        id: genre.id,
        name: genre.name
      }))
    });
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;