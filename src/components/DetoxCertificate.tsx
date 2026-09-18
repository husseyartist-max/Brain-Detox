import React, { useEffect } from 'react';
import { Award, Sparkles, Check, Share2, RotateCcw, ArrowLeft, ShieldCheck, Download, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DetoxMachineState } from '../types';
import { sound } from '../utils/audio';

interface DetoxCertificateProps {
  state: DetoxMachineState;
  onRecalibrate: () => void;
  onBackToExhibits: () => void;
}

export const DetoxCertificate: React.FC<DetoxCertificateProps> = ({
  state,
  onRecalibrate,
  onBackToExhibits,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Trigger celebratory confetti on mount
  useEffect(() => {
    sound.playNirvana();

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#38bdf8', '#a78bfa', '#fcd34d', '#ffffff'],
      });
    } catch {
      // Confetti safety
    }
  }, []);

  const lastThought = state.thoughts.find((t) => t.isUser) || state.thoughts[state.thoughts.length - 1];

  const handleCopySummary = () => {
    sound.playClick();
    const text = `🌿 Brain Rot Detox Machine Result:\n` +
      `Rot Level: 100% ➔ 0% (FULLY CLEANSED)\n` +
      `✅ Exhibit 1: Rhythmic Respiration\n` +
      `✅ Exhibit 2: Touch Grass Meadow\n` +
      `✅ Exhibit 3: Scroll Sins Incinerated (${state.confessions.length} purged)\n` +
      `✅ Exhibit 4: 15s Zero-Input Quarantine\n` +
      `✅ Exhibit 5: Honest Thought: "${lastThought ? lastThought.text : 'Grounded'}"\n` +
      `Official Decontamination Certificate #ROT-000`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DECONTAMINATION PROTOCOL COMPLETE • ROT: 0%</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Clear Mind Nirvana Achieved
        </h2>
        <p className="text-sm text-slate-400 mt-2 font-sans max-w-lg mx-auto leading-relaxed">
          Your limbic system has officially decoupled from algorithmic short-form loops. Your certificate of sensory restoration is verified below.
        </p>
      </div>

      {/* The Official Certificate Document */}
      <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 shadow-[0_0_60px_rgba(16,185,129,0.15)] overflow-hidden">
        
        {/* Subtle Watermark Badge */}
        <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
          <Award className="w-48 h-48 text-emerald-400" />
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-emerald-500/30 pb-6 mb-6 gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
              OFFICIAL SANCTUARY ACCREDITATION
            </div>
            <h3 className="text-2xl font-display font-black text-white mt-1">
              Certificate of Brain Rot Decontamination
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Serial No: #NIRVANA-ROT-000 • Protocol: 5-Exhibit Full Purge
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center shrink-0">
            <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">
              ROT METER
            </span>
            <span className="text-3xl font-mono font-extrabold text-emerald-300">
              0%
            </span>
            <span className="text-[10px] font-mono text-slate-400 block">
              PURGED
            </span>
          </div>
        </div>

        {/* Core Verification Details */}
        <div className="space-y-4 mb-8">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            DECONTAMINATION VERIFICATION LOG:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <div>
                <div className="text-xs font-semibold text-white">1. Respiration Chamber</div>
                <div className="text-[11px] text-slate-400 font-mono">Box-breathing synced (Cortisol stabilized)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <div>
                <div className="text-xs font-semibold text-white">2. Touch Grass Meadow</div>
                <div className="text-[11px] text-slate-400 font-mono">Tactile contact quota satisfied (100%)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <div>
                <div className="text-xs font-semibold text-white">3. Scroll Sins Incinerator</div>
                <div className="text-[11px] text-slate-400 font-mono">{state.confessions.length || 1} algorithmic habits turned to ash</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <div>
                <div className="text-xs font-semibold text-white">4. Zero-Input Quarantine</div>
                <div className="text-[11px] text-slate-400 font-mono">15s Stillness preserved without twitches</div>
              </div>
            </div>
          </div>

          {/* User's Honest Thought Carving */}
          {lastThought && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold mb-1">
                <span>5. ENGRAVED HONEST THOUGHT:</span>
                <span>VERIFIED AUTHENTIC</span>
              </div>
              <p className="text-sm italic font-sans text-slate-200">
                "{lastThought.text}"
              </p>
            </div>
          )}
        </div>

        {/* Certificate Footer / Seal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-400/60 bg-emerald-950/40 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
              SEAL
            </div>
            <div className="text-xs font-mono text-slate-400">
              <div className="text-slate-200 font-bold">SANCTUARY CLEARANCE AUTHORIZED</div>
              <div>Issued: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-certificate-btn"
              onClick={handleCopySummary}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <button
          id="back-to-exhibits-btn"
          onClick={() => {
            sound.playClick();
            onBackToExhibits();
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-850 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Inspect Exhibits</span>
        </button>

        <button
          id="recalibrate-all-btn"
          onClick={() => {
            sound.playClick();
            onRecalibrate();
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/60 text-slate-300 hover:text-rose-300 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Recalibrate Machine (Start Fresh)</span>
        </button>
      </div>
    </div>
  );
};
