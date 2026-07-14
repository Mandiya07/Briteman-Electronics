import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Bot, User, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface AiAssistantProps {
  products: Product[];
  onOpenProductDetail: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export default function AiAssistant({
  products,
  onOpenProductDetail,
  onAddToCart
}: AiAssistantProps) {
  
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; recommendedProducts?: Product[] }[]>([
    {
      sender: 'bot',
      text: "Hi! Welcome to Briteman Services. I'm your Smart Silicon Assistant. Ask me to find energy backups, student notebooks under E10,000, or cartridge-free Epson EcoTanks!"
    }
  ]);
  
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    { label: "Laptops under E10,000", q: "I'm looking for a robust student laptop below E10,000 Eswatini lilangeni." },
    { label: "APC load-shedding UPS", q: "Which UPS models do you stock to help protect my routers from power load-shedding?" },
    { label: "Canon Ink jet wireless", q: "Show me multifunction Canon or Epson wireless printers that support cartridge-free bottling." }
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setUserInput('');
    setLoading(true);

    try {
      // Connect to server-side Gemini router
      const resp = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText })
      });

      if (!resp.ok) {
        throw new Error('Server returned error status');
      }

      const data = await resp.json();
      const botResponse = data.text || data.recommendation || "I searched the catalog, but something went wrong. Let me assist you directly: Please phone our The Hub showroom at +268 7662 3733!";
      
      // Auto-extract recommendations from keywords in the text
      const matchingItems: Product[] = [];
      const textLower = botResponse.toLowerCase();

      products.forEach(p => {
        const brandMatch = textLower.includes(p.brand.toLowerCase());
        const nameMatch = textLower.includes(p.name.toLowerCase()) || p.name.split(' ').some((word: string) => word.length > 3 && textLower.includes(word.toLowerCase()));
        const skuMatch = textLower.includes(p.sku.toLowerCase());

        if ((brandMatch && nameMatch) || skuMatch) {
          if (!matchingItems.some(item => item.id === p.id)) {
            matchingItems.push(p);
          }
        }
      });

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        recommendedProducts: matchingItems.length > 0 ? matchingItems.slice(0, 2) : undefined
      }]);

    } catch (err) {
      console.error(err);
      
      // Graceful local query fallback
      let fallbackText = "I encountered a minor network glitch. Let me check my local cache: ";
      const matches = products.filter(p => p.name.toLowerCase().includes(queryText.toLowerCase()) || p.brand.toLowerCase().includes(queryText.toLowerCase()));
      
      if (matches.length > 0) {
        fallbackText += `I found these products in stock matching your search: "${matches.map(m => m.name).join(', ')}".`;
      } else {
        fallbackText += "Try searching for specific brand tags (like Dell, Epson, iMac, or MacBooks) and I will filter immediately.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: fallbackText }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* HUD Header */}
      <div className="text-left mb-8 flex justify-between items-center bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center space-x-1">
              <span>Briteman Silicon AI Specialist</span>
              <Sparkles className="h-4.3 w-4.3 text-accent animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-400">Grounded catalog assistant connected directly to The Hub Warehouse Stock.</p>
          </div>
        </div>

        <button
          id="clear-ai-chat"
          onClick={() => setMessages([{ sender: 'bot', text: "Hi! Welcome back to Briteman Services. Ask me anything!" }])}
          className="text-xs text-slate-400 hover:text-red-500 flex items-center space-x-1 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset Context</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sample Prompt suggestions Row left */}
        <div className="lg:col-span-3 space-y-3.5 text-left order-2 lg:order-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Core Groundings Selection</span>
          
          <div className="space-y-2">
            {sampleQuestions.map((sq, idx) => (
              <button
                id={`sample-prompt-btn-${idx}`}
                key={idx}
                onClick={() => handleSendMessage(sq.q)}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 transition text-xs space-y-1 block cursor-pointer"
              >
                <div className="flex items-center space-x-1 text-primary dark:text-accent font-bold">
                  <HelpCircle className="h-3.8 w-3.8" />
                  <span>{sq.label}</span>
                </div>
                <p className="text-slate-400 leading-normal text-[10px] line-clamp-2">{sq.q}</p>
              </button>
            ))}
          </div>

          <div className="bg-blue-50/40 dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-850 text-[10px] text-slate-500 leading-relaxed">
            * Conversational replies are curated and structured in real-time utilizing secure server side pipelines.
          </div>
        </div>

        {/* Chat box container Right */}
        <div className="lg:col-span-9 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm order-1 lg:order-2 flex flex-col justify-between min-h-[500px]">
          
          {/* Messages scroll box */}
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[380px] pr-2 scrollbar-thin">
            
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={idx} className={`flex ${isBot ? 'justify-start' : 'justify-end'} text-left text-xs sm:text-sm`}>
                  <div className={`flex items-start space-x-2 w-fit max-w-[85%] ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    
                    {/* Avatar circle */}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border uppercase font-display text-[10px] font-bold ${
                      isBot ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/15 text-accent border-accent/20'
                    }`}>
                      {isBot ? <Bot className="h-4.3 w-4.3" /> : 'ME'}
                    </div>

                    {/* Speech bubble */}
                    <div className="space-y-3">
                      <div className={`p-3.5 rounded-2xl leading-normal ${
                        isBot
                          ? 'bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 text-slate-800 dark:text-slate-200'
                          : 'bg-primary text-white font-medium'
                      }`}>
                        {m.text}
                      </div>

                      {/* Display products recommendations */}
                      {isBot && m.recommendedProducts && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {m.recommendedProducts.map((p) => (
                            <div key={p.id} className="bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-800 flex items-center space-x-2.5">
                              <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
                              <div className="min-w-0 flex-1 text-left">
                                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate" title={p.name}>{p.name}</h4>
                                <span className="text-[11px] font-mono font-bold text-primary dark:text-accent">E{p.price.toLocaleString()}</span>
                                <div className="flex space-x-2 mt-1">
                                  <button
                                    id={`ai-view-p-${p.id}`}
                                    onClick={() => onOpenProductDetail(p)}
                                    className="text-[9px] text-primary hover:underline font-bold"
                                  >
                                    Inspect Spec
                                  </button>
                                  <button
                                    id={`ai-add-cart-p-${p.id}`}
                                    onClick={() => onAddToCart(p)}
                                    className="text-[9px] text-emerald-500 hover:underline font-bold"
                                  >
                                    Add Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start text-xs">
                <div className="flex items-center space-x-2.5 text-slate-400 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-2xl border dark:border-slate-850">
                  <Bot className="h-4.3 w-4.3 text-primary animate-bounce" />
                  <span>Thinking & searching warehouse databases...</span>
                </div>
              </div>
            )}

            <div ref={scrollRef}></div>
          </div>

          {/* User query text bar */}
          <div className="pt-4 border-t dark:border-slate-800 mt-4 flex space-x-2">
            <input
              id="ai-user-query-input"
              type="text"
              placeholder="Ask me: Laptop under E10,000, printer cartridge help..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(userInput);
              }}
              disabled={loading}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            
            <button
              id="ai-submit-query-btn"
              onClick={() => handleSendMessage(userInput)}
              disabled={loading || !userInput.trim()}
              className={`p-3 rounded-xl transition cursor-pointer ${
                userInput.trim()
                  ? 'bg-primary hover:bg-primary-hover text-white'
                  : 'bg-slate-100 text-slate-455 dark:bg-slate-900'
              }`}
            >
              <Send className="h-4.2 w-4.2" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
