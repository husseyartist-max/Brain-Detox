import React, { useState } from 'react';
import { Feather, Sparkles, Send, CheckCircle2, MessageSquareQuote, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HonestThoughtItem } from '../types';
import { sound } from '../utils/audio';

interface ExhibitThoughtProps {
  isCompleted: boolean;
  thoughts: HonestThoughtItem[];
  onSubmitThought: (text: string) => void;
  onViewCertificate: () => void;
}

const PROMPT_SUGGESTIONS = [
  "A simple physical thing I enjoyed recently that had nothing to do with a screen...",
  "Something I am completely tired of performing for others...",
  "A small kindness someone gave me that I never forgot...",
  "What I actually wish I was doing with my afternoons instead of scrolling...",
];

export const ExhibitThought: React.FC<ExhibitThoughtProps> = ({
  isCompleted,
  thoughts,
  onSubmitThought,
  onViewCertificate,
}) => {
  const [thoughtInput, setThoughtInput] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thoughtInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    sound.playNirvana();

    onSubmitThought(thoughtInput.trim());

    setTimeout(() => {
      setIsSubmitting(false);
      setThoughtInput('');
    }, 600);
  };

  const handleApplyPrompt = (prompt: string) => {
    sound.playClick();
    setSelectedPrompt(prompt);
    if (!thoughtInput) {
      setThoughtInput(`${prompt} `);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Exhibit Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-teal-950/50 border border-teal-500/30 text-teal-400 mb-3">
          <Feather className="w-3.5 h-3.5" />
          <span>EXHIBIT 05 OF 05 • PURGES FINAL 20% TO REACH 0%</span>
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
          The Uncurated Monolith
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed font-sans">
          Before you re-enter the digital atmosphere, leave one honest thought. Unoptimized for SEO, unmeasured by engagement algorithms, completely unperformative.
        </p>
      </div>

      {/* Main Form & Reflection Area */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        
        {/* Inspirational Starter Pills */}
        <div>
          <div className="flex items-center justify-between mb-2.5 text-xs font-mono text-slate-400">
            <span>NEED GROUNDING INSPIRATION?</span>
            <span className="text-[11px] text-slate-500">OPTIONAL PROMPT STARTERS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROMPT_SUGGESTIONS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                id={`prompt-suggestion-${idx}`}
                onClick={() => handleApplyPrompt(prompt)}
                className="text-left p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 hover:bg-slate-850 hover:border-teal-500/40 text-xs text-slate-300 transition-all cursor-pointer truncate"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Thought Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              id="honest-thought-textarea"
              rows={4}
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              placeholder="Carve your honest thought here... (e.g., I walked outside at 6 PM and noticed the sunlight turning the maple tree gold, and for 10 minutes I forgot my email inbox existed.)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-400/80 transition-all font-sans leading-relaxed resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs font-mono text-slate-500">
              {thoughtInput.length} chars
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-slate-500">
              Submitting drops the Rot Meter from 20% to 0% (Clear Mind).
            </span>

            <button
              id="submit-honest-thought-btn"
              type="submit"
              disabled={!thoughtInput.trim() || isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-mono text-sm font-bold shadow-[0_0_20px_rgba(45,212,191,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Engrave Thought & Reach 0%</span>
            </button>
          </div>
        </form>

        {/* Existing Constellation of Community Honest Thoughts */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-teal-400" />
              <span>THE REFLECTIVE MONOLITH (AUTHENTIC VOICES)</span>
            </span>
            <span className="text-[11px] text-teal-400 font-semibold">
              {thoughts.length} THOUGHTS ENGRAVED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {thoughts.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                    t.isUser
                      ? 'bg-teal-950/40 border-teal-500/60 text-teal-100 shadow-[0_0_15px_rgba(20,184,166,0.15)] ring-1 ring-teal-500/40'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <p className="italic font-sans mb-2">"{t.text}"</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                    <span className={t.isUser ? 'text-teal-400 font-semibold' : 'text-slate-400'}>
                      {t.author}
                    </span>
                    <span>{new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Completion Action & Certificate Portal */}
        {isCompleted && (
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full Decontamination Complete • Rot Meter is at 0%!</span>
            </div>

            <button
              id="view-certificate-btn"
              onClick={() => {
                sound.playClick();
                onViewCertificate();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono text-sm font-bold shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Decontamination Certificate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
