import React, { useState } from 'react';
import { Flame, Trash2, ArrowRight, CheckCircle2, Sparkles, Send, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRESET_SCROLL_SINS } from '../data/exhibits';
import { ConfessionItem } from '../types';
import { sound } from '../utils/audio';

interface ExhibitConfessProps {
  isCompleted: boolean;
  purgedSins: ConfessionItem[];
  onPurgeSin: (text: string, category: ConfessionItem['category']) => void;
  onNextExhibit: () => void;
}

export const ExhibitConfess: React.FC<ExhibitConfessProps> = ({
  isCompleted,
  purgedSins,
  onPurgeSin,
  onNextExhibit,
}) => {
  const [selectedSinText, setSelectedSinText] = useState<string>('');
  const [customSinText, setCustomSinText] = useState<string>('');
  const [isIncinerating, setIsIncinerating] = useState<boolean>(false);
  const [activeSinBeingBurned, setActiveSinBeingBurned] = useState<string | null>(null);

  const handleIncinerate = (text: string, category: ConfessionItem['category'] = 'doomscroll') => {
    if (!text.trim() || isIncinerating) return;

    setActiveSinBeingBurned(text.trim());
    setIsIncinerating(true);
    sound.playIncinerate();

    // After animation finishes
    setTimeout(() => {
      onPurgeSin(text.trim(), category);
      setIsIncinerating(false);
      setActiveSinBeingBurned(null);
      setSelectedSinText('');
      setCustomSinText('');
    }, 1100);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSinText.trim()) {
      handleIncinerate(customSinText.trim(), 'doomscroll');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Exhibit Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-rose-950/50 border border-rose-500/30 text-rose-400 mb-3">
          <Flame className="w-3.5 h-3.5" />
          <span>EXHIBIT 03 OF 05 • PURGES 20% ROT</span>
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
          The Scroll Sin Incinerator
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed font-sans">
          You don’t have to carry the shame of those 3 AM rabbit holes. Confess your most degenerate digital habits and send them directly into the shredder.
        </p>
      </div>

      {/* Main Incinerator Chamber */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        
        {/* Incineration Furnace Visualization */}
        <div className="relative w-full min-h-[170px] bg-slate-950 rounded-xl border border-rose-950/80 p-5 flex flex-col items-center justify-center overflow-hidden">
          {/* Glowing bottom grill */}
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-rose-600/20 via-amber-600/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-1 inset-x-4 flex justify-around opacity-40">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1 h-3 bg-amber-500 rounded-t-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {isIncinerating && activeSinBeingBurned ? (
              <motion.div
                key="burning"
                initial={{ scale: 1, y: 0, opacity: 1 }}
                animate={{
                  scale: [1, 0.98, 0.9, 0.3],
                  y: [0, 10, 45, 90],
                  opacity: [1, 0.9, 0.7, 0],
                  filter: ['blur(0px)', 'blur(1px)', 'blur(3px)', 'blur(8px)'],
                }}
                transition={{ duration: 1.0, ease: 'easeInOut' }}
                className="relative z-10 max-w-lg text-center p-4 rounded-lg bg-rose-950/70 border border-rose-500 text-rose-200 font-mono text-sm shadow-[0_0_30px_rgba(244,63,94,0.6)]"
              >
                <div className="flex items-center justify-center gap-2 mb-1 text-xs text-amber-400">
                  <Flame className="w-4 h-4 animate-bounce" />
                  <span className="font-bold">INCINERATING DIGITAL RESIDUE...</span>
                </div>
                "{activeSinBeingBurned}"
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center z-10 space-y-1"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-rose-400 mb-2">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="text-sm font-mono text-slate-300 font-semibold">
                  FURNACE READY FOR PURGING
                </div>
                <div className="text-xs text-slate-500">
                  Select a sin below or type your custom confession to disintegrate
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preset Sins Selection */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
            <span>PRE-PACKAGED ALGORITHMIC TRANSGRESSIONS</span>
            <span className="text-[11px] text-slate-500">CLICK TO LOAD</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {PRESET_SCROLL_SINS.map((preset, idx) => {
              const alreadyPurged = purgedSins.some((s) => s.text === preset.text);
              const isSelected = selectedSinText === preset.text;

              return (
                <button
                  key={idx}
                  id={`preset-sin-${idx}`}
                  disabled={alreadyPurged || isIncinerating}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSinText(preset.text);
                  }}
                  className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-2.5 ${
                    alreadyPurged
                      ? 'bg-slate-950/40 border-slate-900 text-slate-600 line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-rose-950/40 border-rose-500/60 text-rose-200 ring-1 ring-rose-500/40'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <span className="text-rose-500 font-mono text-xs shrink-0 mt-0.5">
                    {alreadyPurged ? '✓' : `0${idx + 1}`}
                  </span>
                  <span className="flex-1 leading-snug">
                    {preset.text}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedSinText && (
            <div className="mt-3 flex justify-end">
              <button
                id="burn-selected-sin-btn"
                onClick={() => handleIncinerate(selectedSinText, 'shortform')}
                disabled={isIncinerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all cursor-pointer flex items-center gap-2"
              >
                <Flame className="w-4 h-4" />
                <span>Incinerate Selected Sin</span>
              </button>
            </div>
          )}
        </div>

        {/* Custom Confession Input Form */}
        <div className="pt-4 border-t border-slate-800">
          <form onSubmit={handleCustomSubmit} className="space-y-2">
            <label htmlFor="custom-sin-input" className="block text-xs font-mono text-slate-400">
              OR TYPE YOUR OWN CUSTOM SCROLL SIN:
            </label>
            <div className="flex gap-2">
              <input
                id="custom-sin-input"
                type="text"
                value={customSinText}
                onChange={(e) => setCustomSinText(e.target.value)}
                placeholder="e.g., Watched 18 consecutive reels of someone power-washing rugs at 2 AM..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/70 font-sans"
              />
              <button
                id="custom-sin-submit-btn"
                type="submit"
                disabled={!customSinText.trim() || isIncinerating}
                className="px-4 py-2.5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/30 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Drop in Shredder</span>
              </button>
            </div>
          </form>
        </div>

        {/* Purged Sins Vault */}
        {purgedSins.length > 0 && (
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
              <span>INCINERATED ASH VAULT ({purgedSins.length} PURGED)</span>
              <span className="text-emerald-400">ABSOLVED</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {purgedSins.map((sin) => (
                <div
                  key={sin.id}
                  className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center gap-2 line-through decoration-rose-500/60"
                >
                  <Skull className="w-3 h-3 text-slate-600" />
                  <span className="truncate max-w-xs">{sin.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer & Next Exhibit Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-500">
            STATUS: {purgedSins.length > 0 ? `${purgedSins.length} SINS VAPORIZED` : 'WAITING FOR FIRST CONFESSION'}
          </div>

          {isCompleted && (
            <button
              id="confess-next-btn"
              onClick={() => {
                sound.playClick();
                onNextExhibit();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 font-mono text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
            >
              <span>Exhibit IV: Sit in Silence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Completion Banner */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-4 py-1.5 rounded-full self-center"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Exhibit III Cleansed • Rot dropped another -20%</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
