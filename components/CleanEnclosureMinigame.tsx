
import React, { useState, useEffect, useRef } from 'react';

interface CleanEnclosureMinigameProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface Dirt {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const CleanEnclosureMinigame: React.FC<CleanEnclosureMinigameProps> = ({ onComplete, onCancel }) => {
  const [dirtPatches, setDirtPatches] = useState<Dirt[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  // Initialize dirt patches
  useEffect(() => {
    const patches: Dirt[] = [];
    for (let i = 0; i < 20; i++) {
      patches.push({
        id: i,
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 80 + 10,
        size: Math.random() * 30 + 40, // 40px to 70px
        opacity: 1
      });
    }
    setDirtPatches(patches);
  }, []);

  // Check for completion
  useEffect(() => {
    if (dirtPatches.length === 0 && isCleaning) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dirtPatches, onComplete, isCleaning]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCursorPos({ x, y });
    setIsCleaning(true);

    // Cleaning logic: Check collision with dirt
    // We convert mouse px coordinates to percentages for comparison
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setDirtPatches(prev => prev.filter(dirt => {
        // Calculate distance between mouse and center of dirt
        // Simplified distance check (considering aspect ratio roughly 1:1 for simplicity or just loose checking)
        const dx = xPercent - dirt.x;
        const dy = yPercent - dirt.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If close enough (scrubbing), reduce opacity effectively by removing it if it's hit
        // To make it feel like "scrubbing", we effectively just remove it if hovered with a bit of tolerance
        if (distance < 5) {
            return false; // Remove dirt
        }
        return true; // Keep dirt
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 cursor-none">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-amber-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-amber-400 p-4 flex justify-between items-center border-b border-amber-500 z-10 relative">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            🧹 Cleaning Time
          </h2>
          <button 
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Game Container */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative h-96 bg-amber-100 overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(#d4b996 15%, transparent 16%), radial-gradient(#d4b996 15%, transparent 16%)',
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }}
        >
          {/* Instructions Overlay (fades out) */}
          {dirtPatches.length > 0 && !isCleaning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <span className="bg-black/50 text-white px-6 py-3 rounded-full font-bold animate-pulse">
                Move the Broom to Clean!
              </span>
            </div>
          )}

          {/* Dirt Patches */}
          {dirtPatches.map(dirt => (
            <div
              key={dirt.id}
              className="absolute bg-amber-800/60 rounded-full blur-sm transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${dirt.x}%`,
                top: `${dirt.y}%`,
                width: `${dirt.size}px`,
                height: `${dirt.size}px`,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
              }}
            />
          ))}

          {/* Win Message */}
          {dirtPatches.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-green-500/20 backdrop-blur-sm">
              <div className="text-center animate-bounce">
                <span className="text-6xl block">✨</span>
                <span className="text-3xl font-black text-green-700 stroke-white bg-white/80 px-4 py-2 rounded-xl">Sparkling Clean!</span>
              </div>
            </div>
          )}

          {/* Custom Broom Cursor */}
          <div 
            className="absolute pointer-events-none text-6xl transform -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-75"
            style={{ 
              left: cursorPos.x, 
              top: cursorPos.y,
              transform: `translate(-50%, -50%) rotate(${isCleaning ? '-15deg' : '0deg'}) scale(${isCleaning ? 1.1 : 1})`
            }}
          >
            🧹
          </div>
        </div>
        
        {/* Footer info */}
        <div className="p-3 bg-amber-50 text-center text-xs text-amber-700 font-bold uppercase border-t border-amber-200">
          Dirt Remaining: {dirtPatches.length}
        </div>
      </div>
    </div>
  );
};

export default CleanEnclosureMinigame;
