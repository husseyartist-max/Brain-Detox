import React, { useState, useEffect, useRef } from 'react';
import { Wind, Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';

interface ExhibitBreatheProps {
  isCompleted: boolean;
  onComplete: () => void;
  onNextExhibit: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASE_CONFIG: Record<BreathPhase, { text: string; sub: string; duration: number; next: BreathPhase }> = {
  inhale: {
    text: 'Inhale deeply',
    sub: 'Draw in slow, crisp air. Decouple from the screen.',
    duration: 4,
    next: 'hold',
  },
  hold: {
    text: 'Hold stillness',
    sub: 'Let your nervous system suspend the urge to refresh.',
    duration: 4,
    next: 'exhale',
  },
  exhale: {
    text: 'Exhale the feeds',
    sub: 'Release the infinite scroll and mental residue.',
    duration: 4,
    next: 'rest',
  },
  rest: {
    text: 'Rest in the pause',
    sub: 'Nothing to like. Nothing to click. Just this moment.',
    duration: 4,
    next: 'inhale',
  },
};

export const ExhibitBreathe: React.FC<ExhibitBreatheProps> = ({
  isCompleted,
  onComplete,
  onNextExhibit,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState<number>(0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const targetCycles = 3;

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Sound phase trigger
  useEffect(() => {
    if (isActive) {
      sound.playBreathPhase(phase);
    }
  }, [phase, isActive]);

  // Main breath loop
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      return;
    }

    const currentDuration = PHASE_CONFIG[phase].duration * 1000;
    startTimeRef.current = performance.now();

    const loop = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / currentDuration, 1);
      setPhaseProgress(progress);

      if (progress >= 1) {
        // Transition to next phase
        const nextPhase = PHASE_CONFIG[phase].next;
        if (phase === 'rest') {
          // One full cycle finished
          setCompletedCycles((prev) => {
            const nextCount = prev + 1;
            if (nextCount >= targetCycles && !isCompleted) {
              onComplete();
            }
            return nextCount;
          });
        }
        setPhase(nextPhase);
        startTimeRef.current = performance.now();
      } else {
        timerRef.current = requestAnimationFrame(loop);
      }
    };

    timerRef.current = requestAnimationFrame(loop);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isActive, phase, isCompleted, onComplete]);

  const handleToggleSession = () => {
    sound.playClick();
    if (isActive) {
      setIsActive(false);
      setPhase('inhale');
      setPhaseProgress(0);
    } else {
      setIsActive(true);
      setPhase('inhale');
      setPhaseProgress(0);
    }
  };

  const handleResetCycles = () => {
    sound.playClick();
    setIsActive(false);
    setCompletedCycles(0);
    setPhase('inhale');
    setPhaseProgress(0);
  };

  // Visual scale calculation for the breathing orb
  let scale = 1;
  if (phase === 'inhale') {
    scale = 1 + phaseProgress * 0.55;
  } else if (phase === 'hold') {
    scale = 1.55;
  } else if (phase === 'exhale') {
    scale = 1.55 - phaseProgress * 0.55;
  } else {
    scale = 1;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Exhibit Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-sky-950/50 border border-sky-500/30 text-sky-400 mb-3">
          <Wind className="w-3.5 h-3.5" />
          <span>EXHIBIT 01 OF 05 • PURGES 20% ROT</span>
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
          The Respiration Chamber
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed font-sans">
          Your breath has become shallow from scrolling high-speed short video feeds. Complete 3 conscious box-breath cycles to lower your nervous system arousal.
        </p>
      </div>

      {/* Main Breathing Stage */}
      <div className="relative bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[460px] overflow-hidden shadow-2xl">
        {/* Ambient background glow rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-96 h-96 rounded-full border border-sky-500/20 animate-pulse" />
          <div className="w-[500px] h-[500px] rounded-full border border-teal-500/10" />
        </div>

        {/* Breathing Orb Visualization */}
        <div className="relative flex items-center justify-center w-72 h-72 my-4">
          {/* Outer Ripple */}
          <div
            className="absolute rounded-full transition-transform duration-75 ease-out border border-teal-400/20 bg-teal-500/5"
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${scale * 1.15})`,
            }}
          />

          {/* Secondary Harmonic Wave */}
          <div
            className="absolute rounded-full transition-transform duration-75 ease-out border border-sky-400/30 bg-sky-500/10"
            style={{
              width: '80%',
              height: '80%',
              transform: `scale(${scale * 1.05})`,
            }}
          />

          {/* Core Orb */}
          <div
            className="relative rounded-full flex flex-col items-center justify-center text-center p-6 transition-all duration-75 ease-out shadow-[0_0_50px_rgba(56,189,248,0.25)] border border-sky-400/50 bg-gradient-to-br from-slate-900 via-sky-950/80 to-slate-900"
            style={{
              width: '65%',
              height: '65%',
              transform: `scale(${scale})`,
            }}
          >
            <div className="relative z-10">
              <span className="text-[11px] font-mono tracking-widest text-sky-300 font-semibold uppercase block mb-1">
                {isActive ? phase : 'READY'}
              </span>
              <span className="text-lg sm:text-xl font-display font-bold text-white block">
                {isActive ? PHASE_CONFIG[phase].text : 'Begin Detox'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Instructional Subtitle */}
        <div className="text-center min-h-[48px] mt-2 mb-6">
          <p className="text-slate-300 text-sm font-medium">
            {isActive
              ? PHASE_CONFIG[phase].sub
              : 'Press "Start Respiration" to synchronize your lungs with the chamber.'}
          </p>
        </div>

        {/* Cycle Progress Tracker */}
        <div className="w-full max-w-sm bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>DECONTAMINATION CYCLES</span>
            <span className="text-sky-400 font-bold">
              {Math.min(completedCycles, targetCycles)} / {targetCycles}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((cycleNum) => {
              const done = completedCycles >= cycleNum;
              const isCurrent = isActive && completedCycles === cycleNum - 1;
              return (
                <div
                  key={cycleNum}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    done
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                      : isCurrent
                      ? 'bg-sky-500 animate-pulse'
                      : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="breathe-toggle-btn"
            onClick={handleToggleSession}
            className={`px-6 py-3 rounded-xl font-mono text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              isActive
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-gradient-to-r from-sky-500 to-teal-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:brightness-110'
            }`}
          >
            {isActive ? 'Pause Chamber' : 'Start Respiration'}
          </button>

          {completedCycles > 0 && (
            <button
              id="breathe-reset-cycles-btn"
              onClick={handleResetCycles}
              className="px-4 py-3 rounded-xl font-mono text-xs text-slate-400 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Reset breath counter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {isCompleted && (
            <button
              id="breathe-next-btn"
              onClick={() => {
                sound.playClick();
                onNextExhibit();
              }}
              className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 font-mono text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
            >
              <span>Exhibit II: Touch Grass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Completion Notice */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Exhibit I Cleansed • Rot dropped -20%</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
