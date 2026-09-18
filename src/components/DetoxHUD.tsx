import React from 'react';
import { Volume2, VolumeX, RotateCcw, ShieldCheck, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { EXHIBITS } from '../data/exhibits';
import { ExhibitId, DetoxMachineState } from '../types';
import { sound } from '../utils/audio';

interface DetoxHUDProps {
  state: DetoxMachineState;
  onSelectExhibit: (id: ExhibitId) => void;
  onToggleSound: () => void;
  onReset: () => void;
}

export const DetoxHUD: React.FC<DetoxHUDProps> = ({
  state,
  onSelectExhibit,
  onToggleSound,
  onReset,
}) => {
  const { rotLevel, activeExhibit, completedExhibits, soundEnabled } = state;

  // Status diagnostics based on current rot level
  const getDiagnosticStatus = (rot: number) => {
    if (rot >= 85) {
      return {
        label: 'CRITICAL ROT SATURATION',
        desc: 'Short-form dopamine loop overload. Cortisol spike detected.',
        color: 'text-rose-400 border-rose-500/40 bg-rose-950/30',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
        dotColor: 'bg-rose-500',
      };
    } else if (rot >= 65) {
      return {
        label: 'HEAVY FEED WITHDRAWAL',
        desc: 'Limbic system recalibrating. Biophilic contact advised.',
        color: 'text-amber-400 border-amber-500/40 bg-amber-950/30',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        dotColor: 'bg-amber-500',
      };
    } else if (rot >= 40) {
      return {
        label: 'MODERATE SENSORY PURGE',
        desc: 'Algorithmic habits shedding. Digital guilt incinerating.',
        color: 'text-yellow-300 border-yellow-500/40 bg-yellow-950/30',
        badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        dotColor: 'bg-yellow-400',
      };
    } else if (rot >= 15) {
      return {
        label: 'CALM EQUILIBRIUM APPROACHING',
        desc: 'Attention span stabilizing. Neural noise declining rapidly.',
        color: 'text-teal-300 border-teal-500/40 bg-teal-950/30',
        badge: 'bg-teal-500/20 text-teal-300 border-teal-500/50',
        dotColor: 'bg-teal-400',
      };
    } else {
      return {
        label: 'ORGANIC CLARITY RESTORED',
        desc: 'Brain rot purged. Pure presence and authentic consciousness.',
        color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        dotColor: 'bg-emerald-400',
      };
    }
  };

  const status = getDiagnosticStatus(rotLevel);

  return (
    <header className="relative w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md z-30">
      {/* Top Telemetry Strip */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between border-b border-slate-900/90 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status.dotColor} animate-ping`} />
            <span className={`w-2 h-2 rounded-full ${status.dotColor} -ml-3.5`} />
            <span className="text-slate-400 uppercase tracking-widest text-[11px] font-semibold">
              DETOX-UNIT-V5
            </span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 truncate">
            DECONTAMINATION CHAMBER ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            id="hud-sound-toggle-btn"
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors cursor-pointer text-xs"
            title={soundEnabled ? 'Mute chamber audio' : 'Enable chamber audio'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline text-slate-500">MUTED</span>
              </>
            )}
          </button>

          {/* Reset chamber */}
          <button
            id="hud-recalibrate-btn"
            onClick={() => {
              onReset();
              sound.playClick();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-rose-950/50 hover:border-rose-700/50 border border-slate-700/60 text-slate-300 hover:text-rose-300 transition-all cursor-pointer text-xs"
            title="Recalibrate chamber to 100% rot"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RECALIBRATE</span>
          </button>
        </div>
      </div>

      {/* Main Meter & Header Body */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          {/* Left: Branding & Machine Descriptor */}
          <div className="lg:col-span-4 space-y-1">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider border border-slate-800 bg-slate-900/60 text-slate-400">
              <span className="text-emerald-400 font-bold">NEURAL RESTORATION</span>
              <span>•</span>
              <span>5 EXHIBITS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-white flex items-center gap-2">
              Brain Rot Detox Machine
              {rotLevel === 0 && <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-sans max-w-md">
              Step through the 5 sensory de-escalation chambers to purge algorithmic sludge and reset your rot meter from 100% to 0%.
            </p>
          </div>

          {/* Center: Real-Time Rot Meter HUD */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-xl border border-slate-800 p-4 relative overflow-hidden shadow-2xl">
            {/* Background ECG/Oscilloscope grid lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                  ROT METER LEVEL
                </span>
                {rotLevel > 70 ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <span className={`text-xs font-mono font-medium ${status.badge} px-2 py-0.5 rounded border text-[11px]`}>
                {status.label}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Massive LED readout */}
              <div className="relative font-mono font-extrabold text-4xl md:text-5xl tracking-tighter flex items-baseline">
                <span className={`transition-colors duration-700 ${
                  rotLevel > 60 ? 'text-rose-400' : rotLevel > 20 ? 'text-amber-300' : 'text-emerald-400'
                } ${rotLevel > 80 ? 'rot-twitch' : ''}`}>
                  {rotLevel}
                </span>
                <span className="text-lg text-slate-500 ml-1">%</span>
              </div>

              {/* Progress bar container */}
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-full bg-slate-950 rounded-full border border-slate-800 p-0.5 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      rotLevel > 60
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                        : rotLevel > 20
                        ? 'bg-gradient-to-r from-teal-500 to-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                        : 'bg-gradient-to-r from-teal-400 to-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                    }`}
                    style={{ width: `${Math.max(3, rotLevel)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0% NIRVANA</span>
                  <span>50% STABLE</span>
                  <span>100% BRAIN FRIED</span>
                </div>
              </div>
            </div>

            {/* Neural state caption */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px] text-slate-400 truncate pr-2">
                {status.desc}
              </span>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold shrink-0">
                {5 - Object.values(completedExhibits).filter(Boolean).length} REMAINING
              </span>
            </div>
          </div>

          {/* Right: Quick Telemetry / Micro Waveform */}
          <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>NEURAL FREQUENCY</span>
              <span className="text-slate-200">{rotLevel > 50 ? '38.4 Hz (AGITATED)' : '8.2 Hz (ALPHA/CALM)'}</span>
            </div>
            {/* SVG Waveform simulation */}
            <div className="h-10 w-full bg-slate-950/80 rounded border border-slate-800/70 p-1 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-8" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path
                  d={
                    rotLevel > 60
                      ? "M0,20 Q10,2 20,38 T40,2 T60,38 T80,4 T100,36 T120,3 T140,37 T160,5 T180,35 T200,20"
                      : rotLevel > 20
                      ? "M0,20 Q20,10 40,30 T80,10 T120,30 T160,10 T200,20"
                      : "M0,20 Q25,16 50,24 T100,16 T150,24 T200,20"
                  }
                  fill="none"
                  stroke={rotLevel > 60 ? '#f43f5e' : rotLevel > 20 ? '#fbbf24' : '#10b981'}
                  strokeWidth="2"
                  className="transition-all duration-700"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>CORTISOL: {rotLevel}%</span>
              <span>SYNAPTIC HARMONY: {100 - rotLevel}%</span>
            </div>
          </div>

        </div>

        {/* 5 Exhibit Navigation Stepper Tabs */}
        <nav className="mt-5 pt-4 border-t border-slate-800/80" aria-label="Detox Exhibits">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {EXHIBITS.map((ex) => {
              const isCompleted = completedExhibits[ex.id];
              const isActive = activeExhibit === ex.id;
              return (
                <button
                  key={ex.id}
                  id={`exhibit-nav-${ex.id}`}
                  onClick={() => {
                    onSelectExhibit(ex.id);
                    sound.playClick();
                  }}
                  className={`relative text-left p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                      : isCompleted
                      ? 'bg-slate-900/80 border-slate-700/70 hover:bg-slate-850 hover:border-slate-600'
                      : 'bg-slate-950/60 border-slate-800/70 hover:bg-slate-900/60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                      EXHIBIT 0{ex.order}
                    </span>
                    {isCompleted ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        -20%
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-xs sm:text-sm text-slate-200 truncate">
                    {ex.label}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {isCompleted ? 'Cleansed' : isActive ? 'Active Now' : 'Pending'}
                  </div>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};
