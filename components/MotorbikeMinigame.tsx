
import React, { useState, useEffect, useRef } from 'react';
import { Floppa } from '../types';

interface MotorbikeMinigameProps {
  floppa: Floppa;
  onSuccess: () => void;
  onCrash: () => void;
  onCancel: () => void;
  isNightmare?: boolean;
}

interface Obstacle {
  id: number;
  x: number; 
  y: number; 
  type: 'rock' | 'cone' | 'puddle' | 'ghost';
}

interface PoliceEvent {
  active: boolean;
  y: number;
  x: number;
  phase: 'chasing' | 'crashed';
  gap: number;
}

const MotorbikeMinigame: React.FC<MotorbikeMinigameProps> = ({ floppa, onSuccess, onCrash, onCancel, isNightmare }) => {
  const [gameState, setGameState] = useState<'playing' | 'arriving' | 'delivered' | 'crashed'>('playing');
  const [bikeX, setBikeX] = useState(50);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [policeEvent, setPoliceEvent] = useState<PoliceEvent | null>(null);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const gameStartTimeRef = useRef<number | null>(null);
  const policeTriggeredRef = useRef(false);
  const TARGET_DISTANCE = 2500;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft') setBikeX(prev => Math.max(10, prev - 5));
      if (e.key === 'ArrowRight') setBikeX(prev => Math.min(90, prev + 5));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const handleTouch = (e: React.TouchEvent) => {
    if (gameState !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const percentage = (touchX / rect.width) * 100;
    if (percentage < bikeX) setBikeX(prev => Math.max(10, prev - 4));
    else setBikeX(prev => Math.min(90, prev + 4));
  };

  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'arriving') return;
    let lastTime = performance.now();
    const loop = (time: number) => {
      if (gameStartTimeRef.current === null) gameStartTimeRef.current = time;
      const dt = time - lastTime;
      lastTime = time;
      if (gameState === 'playing') {
        scoreRef.current += speed * (dt / 16);
        setDistance(scoreRef.current);
        if (scoreRef.current >= TARGET_DISTANCE) { setGameState('arriving'); setObstacles([]); setPoliceEvent(null); }
        if (!policeEvent && Math.random() < 0.03) {
          setObstacles(prev => [...prev, { id: Date.now() + Math.random(), x: Math.random() * 80 + 10, y: -10, type: (isNightmare ? (Math.random() > 0.5 ? 'ghost' : 'rock') : 'rock') as any }]);
        }
        if (isNightmare && !policeEvent && !policeTriggeredRef.current && time - gameStartTimeRef.current >= 30000) {
           setPoliceEvent({ active: true, y: -20, x: 20 + Math.random() * 60, phase: 'chasing', gap: 20 });
           policeTriggeredRef.current = true;
        }
        setObstacles(prev => {
          let collision = false;
          const next = prev.map(obs => {
            const ny = obs.y + (0.8 * speed);
            if (ny > 75 && ny < 85 && Math.abs(obs.x - bikeX) < 10) collision = true;
            return { ...obs, y: ny };
          }).filter(o => o.y < 110);
          if (collision) { setGameState('crashed'); setTimeout(onCrash, 2000); }
          return next;
        });
      } else {
        setSpeed(p => Math.max(0, p - 0.02));
        setBikeX(p => p + (70 - p) * 0.05);
        if (speed <= 0.1) { setGameState('delivered'); setTimeout(onSuccess, 1500); }
      }
      reqRef.current = requestAnimationFrame(loop);
    };
    reqRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqRef.current);
  }, [gameState, speed, bikeX, isNightmare, policeEvent, onCrash, onSuccess]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4 touch-none">
      <div className={`rounded-3xl shadow-2xl max-w-md w-full h-[600px] border-4 overflow-hidden relative flex flex-col ${isNightmare ? 'bg-black border-red-900' : 'bg-slate-800 border-slate-600'}`}>
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent text-white">
          <div className="px-3 py-1 rounded-full border bg-black/50 border-white/20"><span className="text-sm font-bold uppercase mr-2 text-amber-400">Dist</span><span className="font-mono">{Math.floor(distance)}m</span></div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-white/20">✕</button>
        </div>

        <div ref={containerRef} className={`relative flex-1 overflow-hidden ${isNightmare ? 'bg-black' : 'bg-neutral-700'}`} onTouchMove={handleTouch}>
            <div className={`absolute inset-y-0 left-4 right-4 border-x-4 ${isNightmare ? 'bg-neutral-900 border-red-900' : 'bg-neutral-800 border-white'}`}>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 border-l-4 border-dashed border-yellow-400 opacity-50"></div>
            </div>

            <div className="absolute right-2 transition-transform duration-1000 z-10" style={{ top: gameState === 'arriving' || gameState === 'delivered' ? '20%' : '-100%', transform: 'translateY(-50%)' }}>
                <div className="text-8xl">{isNightmare ? '🏰' : '🏠'}</div>
            </div>

            {obstacles.map(obs => (
                <div key={obs.id} className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${obs.x}%`, top: `${obs.y}%` }}>{obs.type === 'rock' ? '🪨' : '🚧'}</div>
            ))}

            <div className={`absolute bottom-[15%] transition-all duration-75 transform -translate-x-1/2 z-20 ${gameState === 'crashed' ? 'rotate-90 grayscale' : ''}`} style={{ left: `${bikeX}%` }}>
                <div className="relative">
                    <span className="text-6xl block transform scale-x-[-1]">{isNightmare ? '🔥' : '🏍️'}</span>
                    <div className={`absolute -top-6 -right-2 w-12 h-12 bg-white rounded-lg border-2 border-slate-300 p-0.5 shadow-md flex items-center justify-center ${gameState === 'crashed' ? 'animate-ping' : 'animate-bounce'}`}>
                       <img src={floppa.image} className="w-full h-full object-contain" alt="Delivering Floppa" />
                    </div>
                </div>
            </div>

            {gameState === 'crashed' && <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 backdrop-blur-sm z-30"><h2 className="text-5xl font-black text-white">CRASH!</h2></div>}
            {gameState === 'delivered' && <div className="absolute inset-0 flex items-center justify-center bg-green-900/50 backdrop-blur-sm z-30"><h2 className="text-4xl font-black text-white">DELIVERY COMPLETE!</h2></div>}
        </div>
        
        {gameState === 'playing' && (
             <div className="h-20 flex bg-slate-900 text-white">
                 <div className="flex-1 border-r border-slate-700 flex items-center justify-center active:bg-slate-800" onTouchStart={() => setBikeX(p => Math.max(10, p-10))}>⬅️</div>
                 <div className="flex-1 flex items-center justify-center active:bg-slate-800" onTouchStart={() => setBikeX(p => Math.min(90, p+10))}>➡️</div>
             </div>
        )}
      </div>
    </div>
  );
};

export default MotorbikeMinigame;
