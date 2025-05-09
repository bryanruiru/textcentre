import { supabase } from '../lib/supabase';
import { Book, ChatMessage } from '../types';

// Base API URL for AI services
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://api.textcentre.com/ai';

/**
 * Send a message to the AI assistant and get a response
 */
export const sendChatMessage = async (message: string): Promise<ChatMessage> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get user reading history and preferences for context
    const { data: userBooks } = await supabase
      .from('user_books')
      .select('*')
      .eq('user_id', user.id);
      
    const { data: userPreferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    // Call the AI service with user context
    const response = await fetch(`${AI_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token)}`
      },
      body: JSON.stringify({
        message,
        userId: user.id,
        context: {
          readingHistory: userBooks || [],
          preferences: userPreferences || {}
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get AI response');
    }
    
    const result = await response.json();
    
    // Store the conversation in the database for history
    await supabase.from('chat_history').insert({
      user_id: user.id,
      user_message: message,
      ai_response: result.message,
      timestamp: new Date().toISOString()
    });
    
    return {
      id: result.id || Date.now().toString(),
      content: result.message,
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    // Fallback response if the API fails
    return {
      id: Date.now().toString(),
      content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get personalized book recommendations for the user
 */
export const getBookRecommendations = async (limit = 5, genre?: string): Promise<Book[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Call the AI recommendation service
    const response = await fetch(`${AI_API_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token)}`
      },
      body: JSON.stringify({
        userId: user.id,
        limit,
        genre
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get recommendations');
    }
    
    const result = await response.json();
    return result.recommendations;
  } catch (error) {
    console.error('Error in getBookRecommendations:', error);
    // If the AI service fails, fall back to popular books in the genre
    const query = supabase
      .from('books')
      .select('*')
      .order('popularity', { ascending: false })
      .limit(limit);
      
    if (genre) {
      query.contains('genre', [genre]);
    }
    
    const { data } = await query;
    return data || [];
  }
};
