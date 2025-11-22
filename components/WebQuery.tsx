
import React, { useState, useRef, useEffect } from 'react';
import { runWebQuery } from '../services/geminiService';
import type { Message } from '../types';
import Spinner from './shared/Spinner';
import { SendHorizonal, Globe, Link } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const WebQuery: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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
      const { text, sources } = await runWebQuery(input);
      const auraMessage: Message = { id: (Date.now() + 1).toString(), sender: 'aura', text: text, sources: sources };
      setMessages(prev => [...prev, auraMessage]);
    } catch (error) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), sender: 'aura', text: "My connection to external data streams has been compromised. Please verify network integrity." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 border-b border-cyan-500/20 bg-slate-950/50 flex items-center gap-3">
        <Globe className="w-6 h-6 text-cyan-400" />
        <div>
          <h2 className="text-xl font-bold text-cyan-400">Grounded Web Query</h2>
          <p className="text-xs text-slate-400">Access and cite up-to-date information from the web.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
             {msg.sender === 'aura' && <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0 border-2 border-cyan-400"></div>}
            <div className={`max-w-3xl rounded-lg ${
                msg.sender === 'user' 
                ? 'bg-slate-700 text-slate-100 p-4' 
                : 'bg-slate-800/50 text-slate-300'
            }`}>
              <div className="p-4"><ReactMarkdown className="prose prose-invert prose-sm max-w-none">{msg.text}</ReactMarkdown></div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 p-4 border-t border-slate-700">
                  <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2"><Link size={14} /> SOURCES:</h4>
                  <ul className="space-y-1">
                    {msg.sources.map((source, index) => (
                      <li key={index}>
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs hover:underline truncate block">
                          {index + 1}. {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0 border-2 border-cyan-400"></div>
            <div className="max-w-xl p-4 rounded-lg bg-slate-800/50 flex items-center">
              <Spinner />
              <span className="ml-2 text-slate-400 text-sm">Accessing external data streams...</span>
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
            placeholder="Ask a question requiring current information..."
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

export default WebQuery;
