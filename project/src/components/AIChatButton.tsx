import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { useAppStore } from '../store';
import { sendChatMessage } from '../services/aiService';
import { ChatMessage } from '../types';
import toast from 'react-hot-toast';

const AIChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { auth } = useAppStore();
  
  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          content: "Hello! I'm your AI book assistant. How can I help you today? Looking for book recommendations or have questions about our library?",
          role: 'assistant',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [messages.length]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      toast.error('Please log in to use the AI assistant');
      return;
    }
    
    // Check if user has premium (if AI is a premium feature)
    if (!auth.user?.isPremium) {
      toast.error('AI assistant is a premium feature. Please upgrade to use it.');
      return;
    }
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const aiResponse = await sendChatMessage(inputValue);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label="Open AI Book Assistant"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 max-h-[500px]">
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare size={20} className="mr-2" />
              <h3 className="font-medium">AI Book Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close AI Assistant"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                <div 
                  className={`rounded-lg py-2 px-3 max-w-[85%] ${message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-200'}`}
                >
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className="text-sm">{line}</p>
                  ))}
                  
                  {/* If the message contains a list, render it properly */}
                  {message.content.includes('* ') && (
                    <ul className="text-sm list-disc pl-5 mt-1 space-y-1">
                      {message.content
                        .split('\n')
                        .filter(line => line.trim().startsWith('* '))
                        .map((line, i) => (
                          <li key={i}>{line.replace('* ', '')}</li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg py-2 px-3 text-gray-800 dark:text-gray-200">
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about books, genres, authors..."
                className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatButton;