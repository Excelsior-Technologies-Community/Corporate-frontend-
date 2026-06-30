import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

const socket = io('http://localhost:5000');

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am the Corporate support bot. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Listen for socket replies
  useEffect(() => {
    socket.on('chatReply', (answer) => {
      setMessages((prev) => [...prev, { role: 'bot', content: answer }]);
      setIsTyping(false);
    });

    return () => {
      socket.off('chatReply');
    };
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      socket.emit('chatMessage', userMessage.content);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Sorry, I am having trouble connecting right now. Please try again shortly.' }]);
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 text-white rotate-90 scale-90 opacity-0 pointer-events-none' 
            : 'bg-[#1a1f2c] hover:bg-[#2a3142] text-white rotate-0 scale-100 hover:scale-110 shadow-[0_10px_30px_rgba(26,31,44,0.3)]'
        }`}
        aria-label="Toggle Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-400 ease-out z-50 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ height: '600px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a1f2c] to-[#2a3142] p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Bot className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Corporate Support</h3>
              <p className="text-xs text-indigo-200 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
              </p>
            </div>
          </div>
          <button 
            onClick={toggleChat}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-5 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
                  {msg.role === 'user' ? (
                    <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <User className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {/* Bubble */}
                <div 
                  className={`px-4 py-3 rounded-2xl text-[15px] shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-white border border-gray-200 flex items-center justify-center text-gray-600 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-5 py-3.5 rounded-2xl bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSubmit} className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-[15px] rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md"
            >
              <Send className="w-5 h-5 -ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-gray-400 font-medium">Powered by Corporate Chat</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
