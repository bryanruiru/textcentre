// AI Service for TextCentre
// This is a placeholder implementation that simulates AI responses
// In a production environment, this would connect to a real AI model like OpenAI, Cohere, etc.

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Verify JWT token from Supabase
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token' });
  }
  
  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Check if user has premium access
const checkPremiumAccess = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('is_premium')
      .eq('id', req.user.id)
      .single();
      
    if (error || !data.is_premium) {
      return res.status(403).json({ error: 'Premium subscription required' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error checking premium status' });
  }
};

// AI Chat endpoint
app.post('/chat', authenticateToken, checkPremiumAccess, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // In a real implementation, this would call an AI model API
    // For now, we'll use a simple rule-based response system
    
    let response = '';
    
    if (message.toLowerCase().includes('recommend') || message.toLowerCase().includes('suggestion')) {
      response = "Based on your reading history, I recommend these books:\n\n* The Silent Patient by Alex Michaelides\n* Project Hail Mary by Andy Weir\n* The Midnight Library by Matt Haig\n\nWould you like more details about any of these?";
    } else if (message.toLowerCase().includes('genre') || message.toLowerCase().includes('category')) {
      response = "I see you enjoy mystery and science fiction books. Have you tried these popular titles in those genres?\n\n* Klara and the Sun by Kazuo Ishiguro\n* The Thursday Murder Club by Richard Osman\n* Recursion by Blake Crouch";
    } else if (message.toLowerCase().includes('author')) {
      response = "Some authors you might enjoy based on your reading patterns:\n\n* Tana French\n* N.K. Jemisin\n* Fredrik Backman\n\nTheir writing styles align with books you've enjoyed in the past.";
    } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      response = "Hello! I'm your AI book assistant. How can I help you today? I can recommend books, tell you about authors, or help you discover new genres.";
    } else {
      response = "I'm not sure I understand. Could you rephrase your question? I can help with book recommendations, author information, or finding books in specific genres.";
    }
    
    // Log the interaction for improving the AI
    await supabase.from('ai_interactions').insert({
      user_id: req.user.id,
      query: message,
      response,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      id: Date.now().toString(),
      message: response
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// AI Recommendations endpoint
app.post('/recommendations', authenticateToken, checkPremiumAccess, async (req, res) => {
  try {
    const { limit = 5, genre } = req.body;
    
    // Get user's reading history
    const { data: userBooks } = await supabase
      .from('user_books')
      .select('book_id, progress, rating')
      .eq('user_id', req.user.id);
    
    // In a real implementation, this would use a recommendation algorithm
    // For now, we'll just return popular books, potentially filtered by genre
    
    let query = supabase
      .from('books')
      .select('*')
      .order('popularity', { ascending: false })
      .limit(limit);
      
    if (genre) {
      query = query.contains('genre', [genre]);
    }
    
    const { data: books, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Log the recommendation request
    await supabase.from('ai_recommendations').insert({
      user_id: req.user.id,
      genre: genre || 'all',
      count: books.length,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      recommendations: books
    });
  } catch (error) {
    console.error('Error in AI recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});
