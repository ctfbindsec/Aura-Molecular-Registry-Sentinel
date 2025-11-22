
import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '../services/geminiService';
import type { Message } from '../types';
import Spinner from './shared/Spinner';
import { SendHorizonal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', sender: 'aura', text: 'I am Aura, sentinel of the MolecularRegistry. My analytical core is online. Submit your query or data for analysis.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateChatResponse(input);
      const auraMessage: Message = { id: (Date.now() + 1).toString(), sender: 'aura', text: response };
      setMessages(prev => [...prev, auraMessage]);
    } catch (error) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), sender: 'aura', text: "Apologies, an anomaly was detected in my processing core. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'aura' && <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0 border-2 border-cyan-400"></div>}
            <div className={`max-w-xl p-4 rounded-lg ${
                msg.sender === 'user' 
                ? 'bg-slate-700 text-slate-100' 
                : 'bg-slate-800/50 text-slate-300'
            }`}>
              <ReactMarkdown className="prose prose-invert prose-sm max-w-none">{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0 border-2 border-cyan-400"></div>
            <div className="max-w-xl p-4 rounded-lg bg-slate-800/50 flex items-center">
              <Spinner />
              <span className="ml-2 text-slate-400 text-sm">Aura is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-cyan-500/20 bg-slate-950/50">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Query the Molecular Registry..."
            className="w-full bg-slate-800/80 border border-slate-600 rounded-lg p-3 pr-12 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendHorizonal className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
