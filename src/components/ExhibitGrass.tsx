import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, Hand } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';

interface ExhibitGrassProps {
  isCompleted: boolean;
  onComplete: () => void;
  onNextExhibit: () => void;
}

interface GrassBlade {
  x: number;
  baseY: number;
  height: number;
  width: number;
  bend: number; // current bend
  targetBend: number;
  springVelocity: number;
  color: string;
  hasDew: boolean;
  dewScatterTime?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  life: number;
}

export const ExhibitGrass: React.FC<ExhibitGrassProps> = ({
  isCompleted,
  onComplete,
  onNextExhibit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rustleCount, setRustleCount] = useState<number>(0);
  const targetRustles = 80;
  const isInteractingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const lastSoundTimeRef = useRef<number>(0);

  const bladesRef = useRef<GrassBlade[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Milestone commentary
  const getCommentary = (count: number) => {
    const pct = Math.min(Math.round((count / targetRustles) * 100), 100);
    if (pct === 0) return 'Move your cursor or swipe across the meadow to stroke the grass.';
    if (pct < 25) return 'Tactile sensory contact detected. Genuine chlorophyll frequencies.';
    if (pct < 50) return 'Blue light fatigue dissipating. Neural pathways reconnecting to earth.';
    if (pct < 75) return 'Deep limbic grounding in progress. The algorithm cannot reach you here.';
    if (pct < 100) return 'Nearly purged! Keep brushing the foliage...';
    return '🌱 Grass contact quota satisfied! Biophilic calibration complete.';
  };

  // Initialize blades
  const initGrass = useCallback((width: number, height: number) => {
    const bladeCount = Math.max(120, Math.floor(width / 5));
    const colors = [
      '#10b981', // emerald-500
      '#059669', // emerald-600
      '#34d399', // emerald-400
      '#15803d', // green-700
      '#22c55e', // green-500
      '#84cc16', // lime-500
      '#4ade80', // green-400
    ];

    const blades: GrassBlade[] = [];
    for (let i = 0; i < bladeCount; i++) {
      const x = (i / bladeCount) * width + (Math.random() * 8 - 4);
      const h = height * 0.45 + Math.random() * (height * 0.35);
      blades.push({
        x,
        baseY: height,
        height: h,
        width: 2.5 + Math.random() * 3,
        bend: (Math.random() - 0.5) * 10,
        targetBend: (Math.random() - 0.5) * 8,
        springVelocity: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        hasDew: Math.random() > 0.65,
      });
    }
    bladesRef.current = blades;
  }, []);

  // Handle Resize and Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initGrass(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw warm soil gradient background
      const soilGrad = ctx.createLinearGradient(0, rect.height * 0.7, 0, rect.height);
      soilGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
      soilGrad.addColorStop(0.4, 'rgba(20, 40, 30, 0.4)');
      soilGrad.addColorStop(1, 'rgba(12, 28, 20, 0.85)');
      ctx.fillStyle = soilGrad;
      ctx.fillRect(0, rect.height * 0.6, rect.width, rect.height * 0.4);

      // Render and update blades
      const blades = bladesRef.current;
      for (let i = 0; i < blades.length; i++) {
        const b = blades[i];

        // Spring physics towards natural sway
        const naturalSway = Math.sin(time * 0.0015 + b.x * 0.05) * 12;
        const displacement = b.targetBend + naturalSway - b.bend;
        b.springVelocity += displacement * 18 * dt;
        b.springVelocity *= Math.pow(0.82, dt * 60);
        b.bend += b.springVelocity * dt * 60;

        // Draw blade with quadratic curve
        ctx.beginPath();
        ctx.moveTo(b.x, b.baseY);
        const tipX = b.x + b.bend;
        const tipY = b.baseY - b.height;
        const ctrlX = b.x + b.bend * 0.5;
        const ctrlY = b.baseY - b.height * 0.55;

        ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
        ctx.lineWidth = b.width;
        ctx.strokeStyle = b.color;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw sparkling dew drop on tip if present
        if (b.hasDew) {
          ctx.beginPath();
          ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(224, 255, 255, 0.85)';
          ctx.fill();
        }
      }

      // Render pollen / dew particles
      const particles = particlesRef.current;
      for (let j = particles.length - 1; j >= 0; j--) {
        const p = particles[j];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // float gently upwards
        p.life -= dt * 1.2;
        p.opacity = Math.max(0, p.life);

        if (p.life <= 0) {
          particles.splice(j, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 243, 208, ${p.opacity * 0.7})`;
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initGrass]);

  // Touch / mouse interaction
  const handleInteraction = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    let affectedCount = 0;
    const blades = bladesRef.current;
    const reach = 50;

    for (let i = 0; i < blades.length; i++) {
      const b = blades[i];
      const dist = Math.abs(b.x - x);
      if (dist < reach) {
        // Bend direction depends on swipe vector
        const dir = lastMousePosRef.current ? (x - lastMousePosRef.current.x > 0 ? 1 : -1) : (b.x < x ? -1 : 1);
        const force = (1 - dist / reach) * 45;
        b.springVelocity += dir * force;
        affectedCount++;

        // Scatter dew into particles
        if (b.hasDew && Math.random() > 0.4) {
          b.hasDew = false;
          particlesRef.current.push({
            x: b.x + b.bend,
            y: b.baseY - b.height,
            vx: (Math.random() - 0.5) * 2,
            vy: -1 - Math.random() * 2,
            radius: 1.5 + Math.random() * 2,
            opacity: 1,
            life: 1,
          });
        }
      }
    }

    lastMousePosRef.current = { x, y };

    if (affectedCount > 0) {
      // Play rustle audio throttled
      const now = performance.now();
      if (now - lastSoundTimeRef.current > 70) {
        sound.playGrassRustle();
        lastSoundTimeRef.current = now;
      }

      // Increment progress
      setRustleCount((prev) => {
        const next = prev + 1;
        if (next >= targetRustles && !isCompleted) {
          onComplete();
        }
        return next;
      });
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleInteraction(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setRustleCount(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      initGrass(rect.width, rect.height);
    }
  };

  const progressPercentage = Math.min(Math.round((rustleCount / targetRustles) * 100), 100);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Exhibit Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 mb-3">
          <Hand className="w-3.5 h-3.5" />
          <span>EXHIBIT 02 OF 05 • PURGES 20% ROT</span>
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
          Touch Grass Meadow
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed font-sans">
          The meme was right all along. Drag or stroke the physical blades of grass to ground your sensory cortex and restore natural spatial tactile memory.
        </p>
      </div>

      {/* Main Interactive Grass Stage */}
      <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-between min-h-[480px] overflow-hidden shadow-2xl">
        
        {/* Top Field Telemetry */}
        <div className="w-full flex items-center justify-between z-10 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">
              TACTILE GROUNDING GAUGE
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-emerald-400">
            {progressPercentage}% GROUNDED
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full border border-slate-800 mb-4 overflow-hidden z-10">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-200 shadow-[0_0_12px_rgba(52,211,153,0.6)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Interactive Grass Canvas Area */}
        <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-emerald-950/60 bg-gradient-to-b from-[#0b1319] via-[#0d1a16] to-[#07140f] cursor-grab active:cursor-grabbing group">
          
          {/* Subtle instruction badge inside canvas */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-2 backdrop-blur-sm">
            <Hand className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
            <span>Swipe or drag across the meadow</span>
          </div>

          <canvas
            ref={canvasRef}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            className="w-full h-full block touch-none"
          />
        </div>

        {/* Dynamic commentary caption */}
        <div className="w-full text-center mt-4 min-h-[28px] z-10">
          <p className="text-sm font-medium text-slate-300 font-sans">
            {getCommentary(rustleCount)}
          </p>
        </div>

        {/* Bottom controls */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/80 z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>STROKES: {rustleCount} / {targetRustles}</span>
          </div>

          <div className="flex items-center gap-3">
            {rustleCount > 0 && (
              <button
                id="grass-reset-btn"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Reset grass contact count"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            {isCompleted && (
              <button
                id="grass-next-btn"
                onClick={() => {
                  sound.playClick();
                  onNextExhibit();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 font-mono text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
              >
                <span>Exhibit III: Confess Sins</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Completion Banner */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-4 py-1.5 rounded-full z-10"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Exhibit II Cleansed • Rot dropped another -20%</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
