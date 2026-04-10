
import React, { useState, useEffect, useRef } from 'react';
import { Floppa } from '../types';

interface PlayWithFloppaMinigameProps {
  floppa: Floppa;
  onComplete: () => void;
  onCancel: () => void;
}

const PlayWithFloppaMinigame: React.FC<PlayWithFloppaMinigameProps> = ({ floppa, onComplete, onCancel }) => {
  const [gameState, setGameState] = useState<'aiming' | 'flying' | 'won' | 'missed'>('aiming');
  const [ballPos, setBallPos] = useState({ x: 50, y: 80 }); 
  const [floppaPos, setFloppaPos] = useState({ x: 50, y: 25 }); 
  const [dragVector, setDragVector] = useState({ dx: 0, dy: 0 }); 
  
  const animationRef = useRef<number>(0);
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const ballPosRef = useRef({ x: 50, y: 80 });
  const floppaDirectionRef = useRef(1);

  useEffect(() => {
    const moveFloppa = () => {
      if (gameState === 'won') return;
      setFloppaPos(prev => {
        let newX = prev.x + (0.35 * floppaDirectionRef.current);
        if (newX > 85) { newX = 85; floppaDirectionRef.current = -1; }
        else if (newX < 15) { newX = 15; floppaDirectionRef.current = 1; }
        return { ...prev, x: newX };
      });
      animationRef.current = requestAnimationFrame(moveFloppa);
    };
    if (gameState === 'aiming') animationRef.current = requestAnimationFrame(moveFloppa);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'flying') return;
    let lastTime = performance.now();
    const updatePhysics = (time: number) => {
      const dt = (time - lastTime) / 16;
      lastTime = time;
      const { vx, vy } = velocityRef.current;
      velocityRef.current.vx *= 0.995;
      velocityRef.current.vy *= 0.995;
      ballPosRef.current.x += vx * dt;
      ballPosRef.current.y += vy * dt;
      if (ballPosRef.current.x <= 0 || ballPosRef.current.x >= 100) { velocityRef.current.vx *= -0.8; ballPosRef.current.x = Math.max(0, Math.min(100, ballPosRef.current.x)); }
      if (ballPosRef.current.y <= 0) { velocityRef.current.vy *= -0.8; ballPosRef.current.y = 0; }
      const dx = Math.abs(ballPosRef.current.x - floppaPos.x);
      const dy = Math.abs(ballPosRef.current.y - floppaPos.y);
      if (dx < 12 && dy < 12) { setGameState('won'); setTimeout(onComplete, 1500); return; }
      if (ballPosRef.current.y > 110) {
        setGameState('missed');
        setTimeout(() => { setGameState('aiming'); setBallPos({ x: 50, y: 80 }); ballPosRef.current = { x: 50, y: 80 }; setDragVector({ dx: 0, dy: 0 }); }, 1000);
        return;
      }
      setBallPos({ ...ballPosRef.current });
      animationRef.current = requestAnimationFrame(updatePhysics);
    };
    animationRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState, onComplete, floppaPos.x, floppaPos.y]); 

  const dragStartRef = useRef<{x: number, y: number} | null>(null);
  const handlePointerDown = (e: React.PointerEvent) => { if (gameState !== 'aiming') return; e.preventDefault(); dragStartRef.current = { x: e.clientX, y: e.clientY }; };
  const handlePointerMove = (e: React.PointerEvent) => { if (!dragStartRef.current || gameState !== 'aiming') return; const dx = e.clientX - dragStartRef.current.x; const dy = e.clientY - dragStartRef.current.y; setDragVector({ dx, dy }); };
  const handlePointerUp = () => { if (!dragStartRef.current || gameState !== 'aiming') return; const sensitivity = 0.18; const vx = -dragVector.dx * sensitivity; const vy = -dragVector.dy * sensitivity; if (Math.abs(vx) < 0.2 && Math.abs(vy) < 0.2) { dragStartRef.current = null; setDragVector({ dx: 0, dy: 0 }); return; } velocityRef.current = { vx, vy }; ballPosRef.current = { ...ballPos }; setGameState('flying'); dragStartRef.current = null; setDragVector({ dx: 0, dy: 0 }); };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 touch-none select-none" onPointerUp={handlePointerUp} onPointerMove={handlePointerMove}>
      <div className="bg-sky-200 rounded-3xl shadow-2xl max-w-lg w-full h-[600px] border-4 border-white overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
          <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-sky-800">Play Catch!</div>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center bg-black/20 rounded-full text-white hover:bg-black/40">✕</button>
        </div>

        <div className="absolute inset-0 z-0">
            <div className="absolute bottom-0 w-full h-1/3 bg-green-400 border-t-4 border-green-500"></div>
        </div>

        {gameState === 'aiming' && !dragStartRef.current && (
            <div className="absolute top-1/2 left-0 right-0 text-center pointer-events-none z-10 animate-pulse">
                <span className="bg-white/90 text-sky-600 px-4 py-2 rounded-xl font-bold shadow-sm">Drag & release to throw!</span>
            </div>
        )}

        <div 
          className="absolute w-32 h-32 transition-transform"
          style={{
            left: `${floppaPos.x}%`,
            top: `${floppaPos.y}%`,
            transform: `translate(-50%, -50%) scale(${gameState === 'won' ? 1.3 : 1})`,
          }}
        >
          <img src="https://th.bing.com/th/id/OIP.6s-dhmDgibN2OY5p6goR9AHaGj?w=178&h=158&c=7&r=0&o=7&dpr=2.8&pid=1.7&rm=3&PC=EMMX01" className="w-full h-full object-contain filter drop-shadow-md" alt="Player Floppa" />
          {gameState === 'won' && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-bounce">💖</div>}
        </div>

        {dragStartRef.current && (
            <svg className="absolute inset-0 pointer-events-none z-10 overflow-visible">
                <line x1={`${ballPos.x}%`} y1={`${ballPos.y}%`} x2={`${ballPos.x - (dragVector.dx / 5)}%`} y2={`${ballPos.y - (dragVector.dy / 5)}%`} stroke="white" strokeWidth="4" strokeDasharray="10,5" opacity="0.6" />
            </svg>
        )}

        <div onPointerDown={handlePointerDown} className={`absolute text-5xl z-30 ${gameState === 'aiming' ? 'cursor-grab active:cursor-grabbing' : ''}`} style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%`, transform: `translate(-50%, -50%) translate(${dragVector.dx}px, ${dragVector.dy}px)`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>🎾</div>
        {gameState === 'won' && <div className="absolute inset-0 flex items-center justify-center z-40 bg-green-500/20"><div className="text-center animate-bounce"><span className="text-4xl font-black text-green-600 bg-white px-6 py-3 rounded-2xl shadow-xl border-4 border-green-200">Catch! +Happy</span></div></div>}
      </div>
    </div>
  );
};

export default PlayWithFloppaMinigame;
