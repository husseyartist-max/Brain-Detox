/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DetoxHUD } from './components/DetoxHUD';
import { ExhibitBreathe } from './components/ExhibitBreathe';
import { ExhibitGrass } from './components/ExhibitGrass';
import { ExhibitConfess } from './components/ExhibitConfess';
import { ExhibitSilence } from './components/ExhibitSilence';
import { ExhibitThought } from './components/ExhibitThought';
import { DetoxCertificate } from './components/DetoxCertificate';
import { ExhibitId, DetoxMachineState, ConfessionItem, HonestThoughtItem } from './types';
import { INITIAL_HONEST_THOUGHTS } from './data/exhibits';
import { sound } from './utils/audio';

export default function App() {
  const [state, setState] = useState<DetoxMachineState>({
    rotLevel: 100,
    activeExhibit: 'breathe',
    completedExhibits: {
      breathe: false,
      grass: false,
      confess: false,
      silence: false,
      thought: false,
    },
    exhibitProgress: {
      breatheCycles: 0,
      grassRustles: 0,
      sinsIncinerated: 0,
      silenceSecondsCompleted: 0,
      thoughtSubmitted: false,
    },
    confessions: [],
    thoughts: INITIAL_HONEST_THOUGHTS,
    soundEnabled: true,
    startTime: Date.now(),
  });

  // Calculate live rot level based on completed exhibits
  const updateCompletedExhibit = (exhibitId: ExhibitId) => {
    setState((prev) => {
      if (prev.completedExhibits[exhibitId]) return prev;

      const newCompleted = {
        ...prev.completedExhibits,
        [exhibitId]: true,
      };

      const completedCount = Object.values(newCompleted).filter(Boolean).length;
      const newRot = Math.max(0, 100 - completedCount * 20);

      // Play milestone audio
      if (newRot === 0) {
        sound.playNirvana();
      } else {
        sound.playLevelPurged();
      }

      return {
        ...prev,
        completedExhibits: newCompleted,
        rotLevel: newRot,
        endTime: newRot === 0 ? Date.now() : prev.endTime,
      };
    });
  };

  const handleSelectExhibit = (id: ExhibitId | 'complete') => {
    setState((prev) => ({ ...prev, activeExhibit: id }));
  };

  const handleToggleSound = () => {
    setState((prev) => {
      const nextSound = !prev.soundEnabled;
      sound.setMuted(!nextSound);
      return { ...prev, soundEnabled: nextSound };
    });
  };

  const handleReset = () => {
    setState({
      rotLevel: 100,
      activeExhibit: 'breathe',
      completedExhibits: {
        breathe: false,
        grass: false,
        confess: false,
        silence: false,
        thought: false,
      },
      exhibitProgress: {
        breatheCycles: 0,
        grassRustles: 0,
        sinsIncinerated: 0,
        silenceSecondsCompleted: 0,
        thoughtSubmitted: false,
      },
      confessions: [],
      thoughts: INITIAL_HONEST_THOUGHTS,
      soundEnabled: state.soundEnabled,
      startTime: Date.now(),
    });
  };

  const handlePurgeSin = (text: string, category: ConfessionItem['category']) => {
    const newSin: ConfessionItem = {
      id: `sin-${Date.now()}`,
      text,
      category,
      purgedAt: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      confessions: [newSin, ...prev.confessions],
      exhibitProgress: {
        ...prev.exhibitProgress,
        sinsIncinerated: prev.exhibitProgress.sinsIncinerated + 1,
      },
    }));

    updateCompletedExhibit('confess');
  };

  const handleSubmitThought = (text: string) => {
    const newThought: HonestThoughtItem = {
      id: `thought-${Date.now()}`,
      text,
      author: 'Decontaminated Soul (You)',
      timestamp: Date.now(),
      isUser: true,
    };

    setState((prev) => ({
      ...prev,
      thoughts: [newThought, ...prev.thoughts],
      exhibitProgress: {
        ...prev.exhibitProgress,
        thoughtSubmitted: true,
      },
    }));

    updateCompletedExhibit('thought');
  };

  return (
    <div className="min-h-screen bg-[#080b0f] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden">
      
      {/* Background Subtle Analog Laboratory Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] z-0" />
      
      {/* Scanline overlay for analog detox terminal atmosphere */}
      <div className="fixed inset-0 crt-scanlines z-20 pointer-events-none opacity-40" />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Real-time Top HUD & Rot Meter */}
        <DetoxHUD
          state={state}
          onSelectExhibit={handleSelectExhibit}
          onToggleSound={handleToggleSound}
          onReset={handleReset}
        />

        {/* Main Stage: Active Exhibit */}
        <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6" id="chamber-main-stage">
          {state.activeExhibit === 'complete' || (state.rotLevel === 0 && state.activeExhibit === 'thought' && state.completedExhibits.thought) ? (
            <DetoxCertificate
              state={state}
              onRecalibrate={handleReset}
              onBackToExhibits={() => handleSelectExhibit('breathe')}
            />
          ) : state.activeExhibit === 'breathe' ? (
            <ExhibitBreathe
              isCompleted={state.completedExhibits.breathe}
              onComplete={() => updateCompletedExhibit('breathe')}
              onNextExhibit={() => handleSelectExhibit('grass')}
            />
          ) : state.activeExhibit === 'grass' ? (
            <ExhibitGrass
              isCompleted={state.completedExhibits.grass}
              onComplete={() => updateCompletedExhibit('grass')}
              onNextExhibit={() => handleSelectExhibit('confess')}
            />
          ) : state.activeExhibit === 'confess' ? (
            <ExhibitConfess
              isCompleted={state.completedExhibits.confess}
              purgedSins={state.confessions}
              onPurgeSin={handlePurgeSin}
              onNextExhibit={() => handleSelectExhibit('silence')}
            />
          ) : state.activeExhibit === 'silence' ? (
            <ExhibitSilence
              isCompleted={state.completedExhibits.silence}
              onComplete={() => updateCompletedExhibit('silence')}
              onNextExhibit={() => handleSelectExhibit('thought')}
            />
          ) : (
            <ExhibitThought
              isCompleted={state.completedExhibits.thought}
              thoughts={state.thoughts}
              onSubmitThought={handleSubmitThought}
              onViewCertificate={() => handleSelectExhibit('complete')}
            />
          )}
        </main>

        {/* Footer Chamber Telemetry */}
        <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-3 px-4 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>BRAIN ROT DECONTAMINATION PROTOCOL V5.2</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>UNSUBSCRIBE FROM THE HYPER-FEED</span>
            <span>•</span>
            <span>RESTORE ATTENTION TO ZERO PERCENT</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
