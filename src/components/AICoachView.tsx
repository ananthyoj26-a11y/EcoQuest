import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import {
  Bot,
  Send,
  Sparkles,
  User as UserIcon,
  FileText,
  Loader2,
  BrainCircuit,
  Zap
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { audioService } from '../services/audioService';

interface Props {
  user: User;
}

export const AICoachView: React.FC<Props> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'ai',
      text: `Greetings, ${user.name}! I am ECO COACH, your AI Sustainability Mentor powered by Gemini. You're currently Level ${user.level} with a ${user.streak}-day streak! How can I optimize your sustainability path today?`,
      timestamp: 'Just now',
      suggestedQuests: ['Zero-Plastic Lunch', 'Water Guardian Portal', 'Energy Saver Raid']
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || isThinking) return;

    audioService.playClick();
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);

    try {
      const historyFormatted = messages.map(m => ({ sender: m.sender, text: m.text }));
      const res = await apiService.askAICoach(promptText, historyFormatted);

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuests: res.suggestedQuests
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    } catch (err) {
      console.error('AI Coach error:', err);
      setIsThinking(false);

      const fallbackMsg: ChatMessage = {
        id: `msg_fallback_${Date.now()}`,
        sender: 'ai',
        text: `Your transport and energy practices are strong! To maximize department score in the Guild War, try completing the Water Guardian portal near Central Library today.`,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handleGenerateReport = async () => {
    audioService.playClick();
    setIsGeneratingReport(true);
    try {
      const res = await apiService.generateWeeklyReport();
      setWeeklyReport(res.report);
      setIsGeneratingReport(false);
    } catch (err) {
      console.error('Report error:', err);
      setIsGeneratingReport(false);
    }
  };

  const quickPrompts = [
    'How do I level up my Eco Spirit fast?',
    'Recommend a high-value quest for today',
    'How can my department win the Guild War?',
    'Give me a tip on water conservation'
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">AI ECO COACH</h1>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                GEMINI 3.6 FLASH
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized AI sustainability mentor analyzing your streak, quests, and department performance.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
          className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold px-4 py-2.5 rounded-2xl transition-colors cursor-pointer flex items-center gap-2 shrink-0"
        >
          {isGeneratingReport ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>GENERATE AI WEEKLY REPORT</span>
        </button>
      </div>

      {/* Weekly Report Modal Banner if generated */}
      {weeklyReport && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 relative">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4" /> PERSONALIZED AI WEEKLY REPORT
            </span>
            <button
              onClick={() => setWeeklyReport(null)}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              DISMISS
            </button>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
            {weeklyReport}
          </div>
        </div>
      )}

      {/* Main Chat Thread Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-sans">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div>{m.text}</div>

                {m.suggestedQuests && m.suggestedQuests.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800 font-mono text-[11px] space-y-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Recommended Quests:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {m.suggestedQuests.map(q => (
                        <span key={q} className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[9px] font-mono mt-1 text-right opacity-60">
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <img src={user.avatar} alt="User" className="w-9 h-9 rounded-xl object-cover border border-emerald-400 shrink-0" />
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 text-xs font-mono text-emerald-400">
              <Bot className="w-5 h-5 animate-pulse" />
              <span>ECO COACH THINKING...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-3 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-none font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="bg-slate-950 hover:bg-emerald-950 text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-2 flex items-center gap-2 border-t border-slate-800"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask ECO COACH anything about campus quests, AI verifications, or sustainability..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
          />
          <button
            type="submit"
            disabled={isThinking || !inputPrompt.trim()}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold p-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
