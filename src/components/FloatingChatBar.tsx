import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  Paperclip,
  Sparkles,
  MessageCircle,
  X,
  Clock,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessage[];
}

interface FloatingChatBarProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

const FloatingChatBar: React.FC<FloatingChatBarProps> = ({
  onSendMessage,
  placeholder = 'Ask War Room about your campaign...',
}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatState, setChatState] = useState<'history' | 'chat' | 'closed'>(
    'closed',
  );
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  // Mock chat history data
  const [chatHistory] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'District 3 Polling Analysis',
      lastMessage: 'Latest polling shows 8% increase in favorability...',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      messages: [
        {
          id: '1-1',
          text: 'How are we performing in District 3?',
          isUser: true,
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: '1-2',
          text: 'District 3 polling shows 8% increase in favorability with strong voter engagement across suburban areas.',
          isUser: false,
          timestamp: new Date(Date.now() - 86400000 + 60000),
        },
      ],
    },
    {
      id: '2',
      title: 'Healthcare Messaging Strategy',
      lastMessage: 'I recommend focusing on policy specifics...',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      messages: [
        {
          id: '2-1',
          text: 'What messaging strategy should we use for healthcare policy?',
          isUser: true,
          timestamp: new Date(Date.now() - 172800000),
        },
        {
          id: '2-2',
          text: 'I recommend focusing on policy specifics and testimonials to build voter trust.',
          isUser: false,
          timestamp: new Date(Date.now() - 172800000 + 120000),
        },
      ],
    },
    {
      id: '3',
      title: 'Opposition Research Summary',
      lastMessage: 'Analysis shows 3 key vulnerabilities...',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      messages: [
        {
          id: '3-1',
          text: "Can you analyze the opposition's weak points?",
          isUser: true,
          timestamp: new Date(Date.now() - 259200000),
        },
        {
          id: '3-2',
          text: 'Analysis shows 3 key vulnerabilities in their healthcare stance that we can leverage.',
          isUser: false,
          timestamp: new Date(Date.now() - 259200000 + 90000),
        },
      ],
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setCurrentMessages((prev) => [...prev, userMessage]);
      setChatState('chat');
      setIsExpanded(true);
      setIsTyping(true);
      onSendMessage(message.trim());
      setMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your question! I'm analyzing your request and will provide detailed insights based on your War Room intelligence.",
          isUser: false,
          timestamp: new Date(),
        };
        setCurrentMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleChatHistory = () => {
    if (chatState === 'history') {
      setChatState('closed');
      setIsExpanded(false);
    } else {
      setChatState('history');
      setIsExpanded(true);
      setActiveChat(null);
    }
  };

  const openChat = (chat: ChatSession) => {
    setActiveChat(chat);
    setCurrentMessages(chat.messages);
    setChatState('chat');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) {return 'Today';}
    if (diffInDays === 1) {return 'Yesterday';}
    if (diffInDays < 7) {return `${diffInDays} days ago`;}
    return date.toLocaleDateString();
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        expandedRef.current &&
        !expandedRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setChatState('closed');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && chatState === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isExpanded, chatState]);

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            ref={expandedRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
          >
            {/* Chat Window Content */}
            <div
              className={`bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden ${
                chatState === 'history'
                  ? 'h-[600px]'
                  : 'min-h-[600px] max-h-[70vh]'
              }`}
            >
              {/* Chat History State */}
              {chatState === 'history' && (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200/50">
                    <h3 className="text-gray-800 font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Recent Conversations
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                      {chatHistory.map((chat) => (
                        <motion.button
                          key={chat.id}
                          onClick={() => openChat(chat)}
                          whileHover={{ scale: 1.02 }}
                          className="w-full p-3 bg-white/60 hover:bg-white/80 rounded-xl border border-gray-200/50 hover:border-gray-300/50 transition-all duration-200 text-left"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-gray-800 font-medium text-sm">
                              {chat.title}
                            </h4>
                            <span className="text-gray-500 text-xs">
                              {formatTime(chat.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs line-clamp-2">
                            {chat.lastMessage}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Active Chat State */}
              {chatState === 'chat' && (
                <div className="flex flex-col h-full">
                  {/* Chat Header */}
                  {activeChat && (
                    <div className="p-3 border-b border-gray-200/50 bg-white/50">
                      <h3 className="text-gray-800 font-medium text-sm">
                        {activeChat.title}
                      </h3>
                    </div>
                  )}

                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-3">
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg text-sm ${
                              msg.isUser
                                ? 'bg-gray-200 text-black'
                                : 'bg-gray-700 text-white'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: 0,
                                }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: 0.2,
                                }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: 0.4,
                                }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple chat bar matching Builder.io design */}
      <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-600/50 rounded-lg">
        <form onSubmit={handleSubmit} className="flex items-center p-3">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder-slate-400 px-4 py-2 focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-2 rounded-md transition-colors ${
              message.trim()
                ? 'text-white hover:bg-slate-700/50'
                : 'text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FloatingChatBar;
