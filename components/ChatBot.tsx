
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToFloppaManager } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hiss-low! I am the Floppa Manager. How can I help you manage your Caracal empire today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const response = await sendMessageToFloppaManager(userMessage);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 flex flex-col h-[500px] overflow-hidden">
      <div className="bg-amber-400 p-4 flex items-center gap-3 border-b border-amber-500">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">
          🧐
        </div>
        <div>
          <h3 className="font-bold text-white leading-tight">Floppa Manager</h3>
          <p className="text-[10px] text-amber-100 font-bold uppercase tracking-wider">AI Expert Assistant</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium shadow-sm ${
              msg.role === 'user' 
                ? 'bg-amber-500 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 rounded-tl-none border border-amber-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-amber-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-amber-50 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask manager for tips..."
          className="flex-1 px-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-white hover:bg-amber-500 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
