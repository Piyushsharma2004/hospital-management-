'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  MessageCircle, 
  Send, 
  ArrowLeft, 
  X,
  UserCircle2, 
  Bot 
} from 'lucide-react';
import apichat from '@/utils/aiclientchatbot';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

const MedicalChatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hello! I'm your AI Medical Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setError(null);

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use the Gemini API client to get response
      const botResponseText = await apichat(inputMessage);

      const botResponse: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage = 'An unexpected error occurred. Please try again.';
      const errorBotMessage: Message = {
        id: Date.now() + 2,
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, errorBotMessage]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-start gap-2">
        {message.sender === 'bot' && <Bot className="w-6 h-6 text-orange-600" />}
        {message.sender === 'user' && <UserCircle2 className="w-6 h-6 text-gray-500" />}
        
        <div className={`
          p-3 rounded-lg max-w-[70%]
          ${message.sender === 'user' 
            ? 'bg-orange-500 text-white' 
            : 'bg-gray-200 text-gray-800'}
        `}>
          <p>{message.text}</p>
          <span className="text-xs text-gray-500 block mt-1">
            {message.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
      </div>
    </div>
  );

  // Desktop Chat Window
  const DesktopChatWindow = () => (
    <div 
      className="fixed bottom-24 right-6 w-96 bg-white 
      rounded-2xl shadow-2xl border border-gray-200 
      flex flex-col overflow-hidden h-[520px] z-[9999]"
    >
      {/* Chat Header */}
      <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <span>Medical AI Assistant</span>
        </div>
        <button onClick={() => setIsChatOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 p-3 rounded-lg">
              <div className="animate-pulse">Typing...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 text-center">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t flex items-center gap-2">
      <input 
  type="text"
  placeholder="Ask a medical question..."
  value={inputMessage}
  onChange={(e) => {
    setInputMessage(e.target.value);
    e.target.focus(); // Explicitly maintain focus
  }}
  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
  disabled={isLoading}
  autoFocus // Add this to help maintain focus
/>
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className={`
            bg-orange-500 text-white p-2 rounded-full 
            ${isLoading || !inputMessage.trim() 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-orange-600'
            }
          `}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Mobile Full Screen Chat Window
  const MobileChatWindow = () => (
    <div 
      className="fixed inset-0 bg-white 
      flex flex-col overflow-hidden z-[9999]"
    >
      {/* Mobile Header */}
      <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
        <button 
          onClick={() => setIsChatOpen(false)} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <span>Medical AI</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 p-3 rounded-lg">
              <div className="animate-pulse">Typing...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 text-center">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t flex items-center gap-2">
      <input 
  type="text"
  placeholder="Ask a medical question..."
  value={inputMessage}
  onChange={(e) => {
    setInputMessage(e.target.value);
    e.target.focus(); // Explicitly maintain focus
  }}
  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
  disabled={isLoading}
  autoFocus // Add this to help maintain focus
/>
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className={`
            bg-orange-500 text-white p-3 rounded-full 
            ${isLoading || !inputMessage.trim() 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-orange-600'
            }
          `}
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const ChatIcon = () => (
    <div 
      onClick={() => setIsChatOpen(true)}
      className="fixed bottom-6 right-6 bg-orange-600 text-white 
      rounded-full p-4 shadow-2xl hover:bg-orange-700 
      transition-all cursor-pointer z-50"
    >
      <MessageCircle className="w-6 h-6" />
    </div>
  );

  return (
    <>
      <ChatIcon />
      {isChatOpen && (isMobile ? <MobileChatWindow /> : <DesktopChatWindow />)}
    </>
  );
};

export default MedicalChatbot;