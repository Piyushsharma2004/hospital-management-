'use client'
import React, { useState } from 'react';
import { Send, UserCircle, Bot, MessageCircle } from 'lucide-react';
import MedicalChatbot from './mainchatbot';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const MedicalChatbot2: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [showMainChatbot, setShowMainChatbot] = useState<boolean>(true);
  const [isChatMinimized, setIsChatMinimized] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    };

    const simulatedBotResponse: Message = {
      id: Date.now() + 1,
      text: `Processing medical query: "${inputMessage}"`,
      sender: 'bot'
    };

    setMessages(prev => [...prev, newUserMessage, simulatedBotResponse]);
    setInputMessage('');
    setShowMainChatbot(false);
  };

  const toggleMainChatbot = () => {
    setShowMainChatbot(prev => !prev);
  };

  if (isChatMinimized) {
    return (
      <button 
        onClick={() => setIsChatMinimized(false)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className=" flex flex-col h-[90vh] w-full mx-auto bg-white shadow-lg rounded-xl border border-orange-100 ">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setIsChatMinimized(true)}
          className="bg-orange-500 text-white p-2 rounded-full"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {showMainChatbot ? (
        <div className='pt-16 h-[75vh]'>
          <MedicalChatbot />
        </div>
      ) : (
        <div className="flex flex-col max-h-[75vh]">
          <div className="flex-grow overflow-y-auto p-4 space-y-4 ">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <Bot className="w-8 h-8 text-orange-600" />
                )}
                <div 
                  className={`p-3 rounded-lg max-w-[70%] ${
                    message.sender === 'user' 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <UserCircle className="w-8 h-8 text-orange-600" />
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-orange-100 flex space-x-2">
            <button 
              onClick={toggleMainChatbot}
              className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Main Chatbot
            </button>
          </div>
        </div>
      )}
      
      <div className="p-4 border-t border-orange-100 flex space-x-2 w-[75vw] ">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a medical question..."
          className="flex-grow p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button 
          onClick={handleSendMessage}
          className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MedicalChatbot2;