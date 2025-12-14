import React, { useState, useRef, useEffect } from 'react';
import { getFoodResponse, getRestaurants } from '../helper/index';
import { FaRobot, FaTimes, FaPaperPlane, FaUtensils, FaInfoCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import '../styles/ChatBot.css';

// Cravey - The Foody AI Assistant
const BOT_NAME = "Cravey";
const BOT_AVATAR = "🤖";
const BOT_TAGLINE = "Your AI Food Companion";

// Quick suggestion chips
const QUICK_SUGGESTIONS = [
  "🍕 Show me trending dishes",
  "🏪 List all restaurants",
  "🌶️ Spicy food options",
  "🥗 Vegetarian dishes",
  "🍜 Chinese food",
  "🌊 Seafood specials"
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hey there! 👋 I'm ${BOT_NAME}, your personal food assistant! I know everything about our restaurants and delicious dishes. Ask me anything!`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [foodsData, setFoodsData] = useState([]);
  const [restaurantsData, setRestaurantsData] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch data from Contentstack on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foods, restaurants] = await Promise.all([
          getFoodResponse(),
          getRestaurants()
        ]);
        setFoodsData(foods || []);
        setRestaurantsData(restaurants || []);
        console.log('[Cravey] Knowledge loaded:', foods?.length, 'dishes,', restaurants?.length, 'restaurants');
      } catch (error) {
        console.error('[Cravey] Error loading knowledge:', error);
      }
    };
    fetchData();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Generate AI response based on query and Contentstack data
  const generateResponse = (query) => {
    const q = query.toLowerCase();
    
    // Restaurant queries
    if (q.includes('restaurant') || q.includes('restaurants') || q.includes('where') || q.includes('list all')) {
      if (restaurantsData.length === 0) {
        return "I'm still loading restaurant data. Please try again in a moment! 🔄";
      }
      
      const restaurantList = restaurantsData.slice(0, 5).map(r => 
        `• **${r.title}** - ${r.tag_line || ''} (${r.address || 'Location available'})`
      ).join('\n');
      
      return `🏪 Here are some amazing restaurants we partner with:\n\n${restaurantList}\n\n${restaurantsData.length > 5 ? `...and ${restaurantsData.length - 5} more! Check out the Restaurants page for the full list.` : ''}`;
    }
    
    // Trending/popular dishes
    if (q.includes('trend') || q.includes('popular') || q.includes('best') || q.includes('top')) {
      const topRated = foodsData
        .filter(f => f.category?.includes('Top Trends'))
        .slice(0, 5);
      
      if (topRated.length > 0) {
        const dishList = topRated.map(f => 
          `• **${f.title}** - ₹${f.rate} (⭐ ${f.ratings?.rating || 'N/A'})`
        ).join('\n');
        return `🔥 Here are our trending dishes:\n\n${dishList}\n\nWant me to tell you more about any of these?`;
      }
      return "Our trending dishes are being updated. Check back soon! 🍳";
    }
    
    // Vegetarian options
    if (q.includes('veg') || q.includes('vegetarian')) {
      const vegDishes = foodsData.filter(f => {
        const cats = (f.category || []).join(' ').toLowerCase();
        const name = (f.title || '').toLowerCase();
        return cats.includes('veg') || name.includes('paneer') || name.includes('veg') || 
               name.includes('dosa') || name.includes('idli');
      }).slice(0, 5);
      
      if (vegDishes.length > 0) {
        const dishList = vegDishes.map(f => 
          `• **${f.title}** - ₹${f.rate} from ${f.mess_name || 'Partner Restaurant'}`
        ).join('\n');
        return `🥗 Great choice! Here are some vegetarian options:\n\n${dishList}\n\nAll fresh and delicious! 🌱`;
      }
    }
    
    // Chinese food
    if (q.includes('chinese') || q.includes('noodle') || q.includes('manchurian')) {
      const chineseDishes = foodsData.filter(f => 
        (f.category || []).some(c => c.toLowerCase().includes('chine'))
      ).slice(0, 5);
      
      if (chineseDishes.length > 0) {
        const dishList = chineseDishes.map(f => 
          `• **${f.title}** - ₹${f.rate} (⭐ ${f.ratings?.rating || 'N/A'})`
        ).join('\n');
        return `🥡 Here are our Chinese delights:\n\n${dishList}\n\nPerfect for your Indo-Chinese cravings! 🍜`;
      }
    }
    
    // Seafood
    if (q.includes('sea') || q.includes('fish') || q.includes('prawn') || q.includes('crab')) {
      const seafood = foodsData.filter(f => 
        (f.category || []).some(c => c.toLowerCase().includes('sea'))
      ).slice(0, 5);
      
      if (seafood.length > 0) {
        const dishList = seafood.map(f => 
          `• **${f.title}** - ₹${f.rate} from ${f.mess_name || 'Partner Restaurant'}`
        ).join('\n');
        return `🦐 Fresh from the coast:\n\n${dishList}\n\nOur seafood is sourced fresh daily! 🌊`;
      }
    }
    
    // Spicy food
    if (q.includes('spicy') || q.includes('hot') || q.includes('chilli') || q.includes('pepper')) {
      const spicyDishes = foodsData.filter(f => {
        const desc = (f.description || '').toLowerCase();
        const name = (f.title || '').toLowerCase();
        return desc.includes('spicy') || desc.includes('chilli') || name.includes('chilli') || 
               name.includes('pepper') || desc.includes('hot');
      }).slice(0, 5);
      
      if (spicyDishes.length > 0) {
        const dishList = spicyDishes.map(f => 
          `• **${f.title}** - ₹${f.rate}`
        ).join('\n');
        return `🌶️ For the spice lovers:\n\n${dishList}\n\nThese will definitely add some heat! 🔥`;
      }
    }
    
    // Drinks
    if (q.includes('drink') || q.includes('juice') || q.includes('lassi') || q.includes('coffee')) {
      const drinks = foodsData.filter(f => 
        (f.category || []).some(c => c.toLowerCase().includes('drink'))
      ).slice(0, 5);
      
      if (drinks.length > 0) {
        const dishList = drinks.map(f => 
          `• **${f.title}** - ₹${f.rate}`
        ).join('\n');
        return `🥤 Refreshing beverages:\n\n${dishList}\n\nPerfect to cool down or energize! ☕`;
      }
    }
    
    // South Indian
    if (q.includes('south') || q.includes('dosa') || q.includes('idli') || q.includes('sambar')) {
      const southIndian = foodsData.filter(f => 
        (f.category || []).some(c => c.toLowerCase().includes('south'))
      ).slice(0, 5);
      
      if (southIndian.length > 0) {
        const dishList = southIndian.map(f => 
          `• **${f.title}** - ₹${f.rate} from ${f.mess_name || 'Partner Restaurant'}`
        ).join('\n');
        return `🍛 Authentic South Indian:\n\n${dishList}\n\nTaste the tradition! 🌺`;
      }
    }
    
    // Price queries
    if (q.includes('cheap') || q.includes('budget') || q.includes('affordable')) {
      const affordable = foodsData
        .filter(f => f.rate && f.rate <= 100)
        .sort((a, b) => a.rate - b.rate)
        .slice(0, 5);
      
      if (affordable.length > 0) {
        const dishList = affordable.map(f => 
          `• **${f.title}** - ₹${f.rate}`
        ).join('\n');
        return `💰 Budget-friendly options under ₹100:\n\n${dishList}\n\nGreat taste, easy on the wallet! 🎉`;
      }
    }
    
    // Search for specific dish
    const matchingDishes = foodsData.filter(f => {
      const title = (f.title || '').toLowerCase();
      const desc = (f.description || '').toLowerCase();
      return title.includes(q) || q.split(' ').some(word => word.length > 3 && title.includes(word));
    });
    
    if (matchingDishes.length > 0) {
      const dish = matchingDishes[0];
      return `🍽️ Found it! **${dish.title}**\n\n` +
        `📍 From: ${dish.mess_name || 'Partner Restaurant'}\n` +
        `💰 Price: ₹${dish.rate}\n` +
        `⭐ Rating: ${dish.ratings?.rating || 'N/A'}\n` +
        `📝 ${dish.description || 'Delicious dish awaits!'}\n\n` +
        `⏰ Available: ${dish.avail_from || '11AM'} - ${dish.avail_until || '10PM'}`;
    }
    
    // Search for specific restaurant
    const matchingRestaurants = restaurantsData.filter(r => {
      const title = (r.title || '').toLowerCase();
      return title.includes(q) || q.split(' ').some(word => word.length > 3 && title.includes(word));
    });
    
    if (matchingRestaurants.length > 0) {
      const rest = matchingRestaurants[0];
      const cuisines = (rest.cuisine_type || []).join(', ');
      return `🏪 **${rest.title}**\n\n` +
        `"${rest.tag_line || ''}"\n\n` +
        `📍 Address: ${rest.address || 'N/A'}, ${rest.city || ''}\n` +
        `📞 Phone: ${rest.phone || 'N/A'}\n` +
        `🍳 Cuisines: ${cuisines || 'Various'}\n` +
        `⭐ Rating: ${rest.ratings?.rating || 'N/A'}\n` +
        `🛵 Delivery: ${rest.delivery_available ? 'Available ✓' : 'Not available'}`;
    }
    
    // Help / greeting
    if (q.includes('help') || q.includes('what can') || q.includes('how')) {
      return `I can help you with:\n\n` +
        `🍕 **Find dishes** - "Show me trending dishes"\n` +
        `🏪 **Browse restaurants** - "List all restaurants"\n` +
        `🔍 **Search** - Ask about any dish or restaurant\n` +
        `🏷️ **Categories** - Veg, Chinese, Seafood, Drinks\n` +
        `💰 **Budget** - "Show cheap options"\n\n` +
        `Just type your question and I'll help! 😊`;
    }
    
    // Greeting
    if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
      return `Hey there! 👋 Great to meet you! I'm ${BOT_NAME}, your personal food guide. What are you craving today? 🍕`;
    }
    
    // Thanks
    if (q.includes('thank') || q.includes('thanks')) {
      return `You're welcome! 😊 Enjoy your food! If you need anything else, I'm here to help. Bon appétit! 🍽️`;
    }
    
    // Default response
    const randomTip = [
      `Try asking about "trending dishes" or "Chinese food"!`,
      `You can search for specific dishes like "Biryani" or "Dosa"!`,
      `Ask me about restaurants in your area!`,
      `Looking for something specific? Just type the dish name!`
    ];
    
    return `Hmm, I'm not sure about that. 🤔\n\n${randomTip[Math.floor(Math.random() * randomTip.length)]}\n\nType "help" to see what I can do!`;
  };

  const handleSendMessage = async (message = inputValue) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: trimmedMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    // Generate and add bot response
    const response = generateResponse(trimmedMessage);
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: response,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <FaTimes className="toggle-icon" />
        ) : (
          <>
            <span className="bot-emoji">{BOT_AVATAR}</span>
            <HiSparkles className="sparkle-icon" />
          </>
        )}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-info">
            <div className="bot-avatar-header">
              <span>{BOT_AVATAR}</span>
              <span className="online-indicator"></span>
            </div>
            <div className="header-text">
              <h3>{BOT_NAME}</h3>
              <p>{BOT_TAGLINE}</p>
            </div>
          </div>
          <button 
            className="close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages Container */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              {msg.type === 'bot' && (
                <div className="message-avatar">{BOT_AVATAR}</div>
              )}
              <div className="message-content">
                <div 
                  className="message-text"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">{BOT_AVATAR}</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 2 && (
          <div className="quick-suggestions">
            {QUICK_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Container */}
        <div className="chatbot-input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about food, restaurants..."
            className="chatbot-input"
            disabled={isTyping}
          />
          <button 
            className="send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </div>

        {/* Powered by footer */}
        <div className="chatbot-footer">
          <FaInfoCircle />
          <span>Powered by Contentstack</span>
        </div>
      </div>
    </>
  );
}

