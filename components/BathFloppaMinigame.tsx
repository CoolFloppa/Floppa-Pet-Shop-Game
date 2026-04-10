
import React, { useState, useEffect, useRef } from 'react';

interface BathFloppaMinigameProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  scale: number;
}

interface WaterDrop {
  id: number;
  x: number;
  y: number;
}

const BathFloppaMinigame: React.FC<BathFloppaMinigameProps> = ({ onComplete, onCancel }) => {
  const [phase, setPhase] = useState<'soap' | 'rinse' | 'done'>('soap');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [waterDrops, setWaterDrops] = useState<WaterDrop[]>([]);
  const [toolPos, setToolPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const REQUIRED_BUBBLES = 40;
  
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    updateToolPos(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateToolPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setToolPos({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    updateToolPos(e);
    if (!isDragging) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const floppaCenterX = rect.width / 2;
    const floppaCenterY = rect.height / 2;
    const distToFloppa = Math.sqrt(Math.pow(toolPos.x - floppaCenterX, 2) + Math.pow(toolPos.y - floppaCenterY, 2));

    if (distToFloppa < 120) {
      if (phase === 'soap') {
        if (Math.random() > 0.7) {
          setBubbles(prev => {
             const isCrowded = prev.some(b => Math.sqrt(Math.pow(b.x - toolPos.x, 2) + Math.pow(b.y - toolPos.y, 2)) < 15);
             if (isCrowded) return prev;
             
             return [...prev, {
                id: Date.now() + Math.random(),
                x: toolPos.x + (Math.random() - 0.5) * 20,
                y: toolPos.y + (Math.random() - 0.5) * 20,
                scale: 0.5 + Math.random() * 0.5
             }];
          });
        }
      } else if (phase === 'rinse') {
        setBubbles(prev => prev.filter(b => {
           const dist = Math.sqrt(Math.pow(b.x - toolPos.x, 2) + Math.pow(b.y - toolPos.y, 2));
           return dist > 35;
        }));

        if (Math.random() > 0.5) {
            setWaterDrops(prev => [...prev, {
                id: Date.now() + Math.random(),
                x: toolPos.x + (Math.random() - 0.5) * 20,
                y: toolPos.y,
            }]);
            setTimeout(() => {
                setWaterDrops(prev => prev.slice(1));
            }, 300);
        }
      }
    }
  };

  useEffect(() => {
    if (phase === 'soap' && bubbles.length >= REQUIRED_BUBBLES) {
        const timer = setTimeout(() => {
            setPhase('rinse');
        }, 500);
        return () => clearTimeout(timer);
    }
    if (phase === 'rinse' && bubbles.length === 0) {
        setPhase('done');
    }
  }, [bubbles.length, phase]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 touch-none select-none">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-blue-200 overflow-hidden relative flex flex-col h-[600px]">
        
        <div className="bg-blue-400 p-4 flex justify-between items-center border-b border-blue-500 z-20">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            🛁 Bath Time
          </h2>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40">✕</button>
        </div>

        <div 
            ref={containerRef}
            className="flex-1 relative bg-cyan-50 cursor-none overflow-hidden"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
        >
            <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
                <span className={`inline-block px-6 py-2 rounded-full font-bold shadow-sm transition-all ${
                    phase === 'soap' ? 'bg-pink-100 text-pink-600 animate-bounce' :
                    phase === 'rinse' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600 scale-110'
                }`}>
                    {phase === 'soap' && '🧼 SCRUB the Floppa!'}
                    {phase === 'rinse' && '🚿 RINSE the bubbles!'}
                    {phase === 'done' && '✨ SQUEAKY CLEAN!'}
                </span>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300">
                <div className={`w-48 h-48 transition-all duration-500 ${phase === 'done' ? 'scale-110 rotate-3 filter brightness-110' : ''}`}>
                    <img src="https://th.bing.com/th/id/OIP.6s-dhmDgibN2OY5p6goR9AHaGj?w=178&h=158&c=7&r=0&o=7&dpr=2.8&pid=1.7&rm=3&PC=EMMX01" className="w-full h-full object-contain" alt="Bathing Floppa" />
                </div>
            </div>

            {bubbles.map(b => (
                <div key={b.id} className="absolute pointer-events-none animate-pop-in" style={{ left: b.x, top: b.y, fontSize: `${b.scale * 20 + 15}px`, transform: 'translate(-50%, -50%)', transition: 'opacity 0.2s' }}>🫧</div>
            ))}

            {waterDrops.map(d => (
                <div key={d.id} className="absolute pointer-events-none text-blue-400 font-bold" style={{ left: d.x, top: d.y, transform: 'translate(-50%, 0)', animation: 'drop 0.3s linear forwards' }}>│</div>
            ))}

            {phase === 'done' && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-30">
                    <button onClick={onComplete} className="group relative px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-black text-2xl rounded-2xl shadow-xl transform transition hover:scale-105 active:scale-95 border-b-4 border-green-700 animate-bounce">
                        <span className="mr-2">✅</span> DONE
                    </button>
                </div>
            )}

            {phase !== 'done' && (
                <div className="absolute pointer-events-none text-6xl z-40 transition-transform duration-75" style={{ left: toolPos.x, top: toolPos.y, transform: `translate(-50%, -50%) ${isDragging ? 'rotate(-20deg) scale(1.1)' : 'rotate(0deg)'}` }}>
                    {phase === 'soap' ? '🧼' : '🚿'}
                    {phase === 'rinse' && isDragging && <div className="absolute top-1/2 left-1/2 text-2xl animate-pulse" style={{ transform: 'translate(-50%, 20px)' }}>💦</div>}
                </div>
            )}
        </div>

        <div className="bg-blue-50 p-2 border-t border-blue-200">
            <div className="w-full h-4 bg-white rounded-full overflow-hidden border border-blue-100">
                <div className={`h-full transition-all duration-300 ${phase === 'soap' ? 'bg-pink-400' : 'bg-blue-400'}`} style={{ width: phase === 'soap' ? `${(bubbles.length / REQUIRED_BUBBLES) * 100}%` : `${((REQUIRED_BUBBLES - bubbles.length) / REQUIRED_BUBBLES) * 100}%` }}></div>
            </div>
            <div className="text-center text-[10px] font-bold text-blue-400 mt-1 uppercase">{phase === 'soap' ? 'Soap Coverage' : phase === 'rinse' ? 'Rinse Progress' : 'Cleanliness 100%'}</div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes pop-in { from { transform: translate(-50%, -50%) scale(0); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } } @keyframes drop { from { transform: translate(-50%, 0); opacity: 1; } to { transform: translate(-50%, 100px); opacity: 0; } }`}} />
      </div>
    </div>
  );
};

export default BathFloppaMinigame;
