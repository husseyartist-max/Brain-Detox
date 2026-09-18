import React, { useState, useEffect, useRef } from 'react';
import { VolumeX, ShieldAlert, ArrowRight, CheckCircle2, RotateCcw, Eye, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';

interface ExhibitSilenceProps {
  isCompleted: boolean;
  onComplete: () => void;
  onNextExhibit: () => void;
}

export const ExhibitSilence: React.FC<ExhibitSilenceProps> = ({
  isCompleted,
  onComplete,
  onNextExhibit,
}) => {
  const TOTAL_SECONDS = 15;
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SECONDS);
  const [disturbanceCount, setDisturbanceCount] = useState<number>(0);
  const [lastDisturbanceMsg, setLastDisturbanceMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSoundDropRef = useRef<number>(0);

  // Handle Disturbance during quarantine
  const triggerDisturbance = (reason: string) => {
    if (!isActive) return;

    sound.playDisturbance();
    setDisturbanceCount((prev) => prev + 1);
    setLastDisturbanceMsg(reason);
    setTimeLeft(TOTAL_SECONDS); // reset timer

    // Auto-clear message after 2.5s
    setTimeout(() => {
      setLastDisturbanceMsg((cur) => (cur === reason ? null : cur));
    }, 2500);
  };

  // Event listeners for stillness quarantine
  useEffect(() => {
    if (!isActive) return;

    let moveDebounce = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Allow very tiny micro-drifts but intercept intentional movement
      const now = performance.now();
      if (now - moveDebounce > 150) {
        moveDebounce = now;
        triggerDisturbance('Mouse twitch detected! Hands off the controls.');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      triggerDisturbance(`Key press intercepted: [${e.key}]. Total silence required.`);
    };

    const handleTouchMove = () => {
      triggerDisturbance('Touch scroll twitch detected! Let the device rest.');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isActive]);

  // Main countdown timer
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Completed!
          if (timerRef.current) clearInterval(timerRef.current);
          setIsActive(false);
          if (!isCompleted) {
            onComplete();
          }
          return 0;
        }

        // Play gentle water drop every 3 seconds
        if (prev % 3 === 0) {
          sound.playSilenceDrop();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isCompleted, onComplete]);

  const handleStartSilence = () => {
    sound.playClick();
    setTimeLeft(TOTAL_SECONDS);
    setLastDisturbanceMsg(null);
    setIsActive(true);
  };

  const handleAbort = () => {
    sound.playClick();
    setIsActive(false);
    setTimeLeft(TOTAL_SECONDS);
  };

  const progressPercent = Math.round(((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Exhibit Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-violet-950/50 border border-violet-500/30 text-violet-400 mb-3">
          <VolumeX className="w-3.5 h-3.5" />
          <span>EXHIBIT 04 OF 05 • PURGES 20% ROT</span>
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
          Zero-Input Quarantine
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed font-sans">
          The brain craves micro-stimulation every 3 seconds. For the next 15 seconds, don’t touch your mouse, keyboard, or screen. Rest your hands and simply exist.
        </p>
      </div>

      {/* Main Stillness Chamber */}
      <div
        ref={containerRef}
        className={`relative rounded-2xl border p-6 sm:p-10 flex flex-col items-center justify-between min-h-[460px] overflow-hidden shadow-2xl transition-all duration-700 ${
          isActive
            ? 'bg-slate-950 border-violet-500/40 ring-1 ring-violet-500/30'
            : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        {/* Subtle Water Zen Ripples in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div
            className={`rounded-full border border-violet-400 transition-all duration-1000 ${
              isActive ? 'w-80 h-80 animate-ping opacity-30' : 'w-48 h-48 opacity-10'
            }`}
          />
          <div
            className={`rounded-full border border-teal-400 transition-all duration-1000 ${
              isActive ? 'w-[420px] h-[420px] animate-pulse opacity-20' : 'w-64 h-64 opacity-5'
            }`}
          />
        </div>

        {/* Status Indicator */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isActive ? 'bg-violet-400 animate-ping' : 'bg-slate-600'
              }`}
            />
            <span className="text-xs font-mono text-slate-300">
              {isActive ? 'QUARANTINE ENFORCED' : 'CHAMBER IDLE'}
            </span>
          </div>

          <div className="text-xs font-mono text-slate-400">
            DISTURBANCES: {disturbanceCount}
          </div>
        </div>

        {/* Center Countdown & Visual Orb */}
        <div className="relative z-10 flex flex-col items-center my-6">
          <div className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center border border-violet-500/30 bg-slate-950 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            
            {/* SVG circular progress indicator */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#1e1b4b"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="4"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Readout */}
            <div className="relative z-10 text-center">
              <span className="text-5xl font-mono font-extrabold text-white tracking-tight block">
                {timeLeft}
              </span>
              <span className="text-xs font-mono text-violet-400 tracking-widest uppercase block mt-1">
                {timeLeft === 0 ? 'CLEANSED' : isActive ? 'SECONDS STILL' : 'TARGET: 15s'}
              </span>
            </div>
          </div>

          {/* Disturbance Warning banner */}
          <div className="h-10 mt-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {lastDisturbanceMsg ? (
                <motion.div
                  key="warning"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/60 text-rose-300 font-mono text-xs shadow-lg"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{lastDisturbanceMsg}</span>
                </motion.div>
              ) : isActive ? (
                <motion.div
                  key="active-msg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-mono text-slate-400 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                  <span>Keep hands off. Motion detector armed.</span>
                </motion.div>
              ) : (
                <div className="text-xs font-mono text-slate-500">
                  Click below when you are ready to let go of the controls.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3 z-10">
          {!isActive ? (
            <button
              id="silence-start-btn"
              onClick={handleStartSilence}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>{isCompleted ? 'Repeat Silence Quarantine' : 'Enter 15s Quarantine'}</span>
            </button>
          ) : (
            <button
              id="silence-abort-btn"
              onClick={handleAbort}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 font-mono text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Abort Quarantine</span>
            </button>
          )}

          {isCompleted && !isActive && (
            <button
              id="silence-next-btn"
              onClick={() => {
                sound.playClick();
                onNextExhibit();
              }}
              className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 font-mono text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
            >
              <span>Exhibit V: Honest Thought</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Completion Badge */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-4 py-1.5 rounded-full z-10"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Exhibit IV Cleansed • Rot dropped another -20% (Down to 20%)</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
